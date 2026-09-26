package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.PaymentDto;
import com.tansu.niraloy.model.*;
import com.tansu.niraloy.repository.*;
import com.tansu.niraloy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TenantDueRepository dueRepository;
    private final TenantCollectionRepository collectionRepository;
    private final PropertyRepository propertyRepository;
    private final OwnerSettlementRepository settlementRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Payment processPayment(PaymentDto dto) {
        String txnId = (dto.getTransactionId() != null && !dto.getTransactionId().isEmpty())
                ? dto.getTransactionId()
                : "TXN-" + (100000 + (System.currentTimeMillis() % 900000));

        Payment payment = Payment.builder()
                .transactionId(txnId)
                .propertyId(dto.getPropertyId() != null ? dto.getPropertyId() : "PROP-UNKNOWN")
                .tenantId(dto.getTenantId() != null ? dto.getTenantId() : "TEN-UNKNOWN")
                .amount(dto.getAmount())
                .paymentType(dto.getPaymentType() != null ? dto.getPaymentType() : "RENT")
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "SYSTEM")
                .status("COMPLETED")
                .paymentDate(LocalDate.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // 1. Settle corresponding TenantDue
        TenantDue targetDue = null;
        if (dto.getDueId() != null && !dto.getDueId().trim().isEmpty()) {
            Optional<TenantDue> dueOpt = dueRepository.findByDueId(dto.getDueId().trim());
            if (dueOpt.isPresent()) targetDue = dueOpt.get();
        }

        if (targetDue == null && dto.getTenantId() != null && dto.getPropertyId() != null) {
            List<TenantDue> dues = dueRepository.findByTenantIdOrTenantEmail(dto.getTenantId(), dto.getTenantId());
            targetDue = dues.stream()
                    .filter(d -> dto.getPropertyId().equalsIgnoreCase(d.getPropertyId()) && !"PAID".equalsIgnoreCase(d.getStatus()))
                    .findFirst()
                    .orElse(null);
        }

        if (targetDue != null) {
            targetDue.setPaidAmount(targetDue.getTotalBilled());
            targetDue.setDueAmount(0.0);
            targetDue.setStatus("PAID");
            dueRepository.save(targetDue);
        }

        // 2. Log collection entry in TenantCollection
        Property prop = propertyRepository.findByPropertyId(dto.getPropertyId()).orElse(null);
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        TenantCollection collection = TenantCollection.builder()
                .collectionId("COL-" + (1000 + (System.currentTimeMillis() % 90000)))
                .transactionId(txnId)
                .tenantId(dto.getTenantId())
                .tenantName(targetDue != null ? targetDue.getTenantName() : "Tenant")
                .tenantPhone(targetDue != null ? targetDue.getTenantPhone() : null)
                .propertyId(dto.getPropertyId())
                .flatTitle(targetDue != null ? targetDue.getFlatTitle() : (prop != null ? prop.getTitle() : "Rental Property"))
                .location(targetDue != null ? targetDue.getLocation() : (prop != null ? prop.getLocation() : "Dhaka"))
                .purpose("RENT")
                .rentMonth(targetDue != null ? targetDue.getDueMonth() : "Current Month")
                .amount(dto.getAmount())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "SYSTEM")
                .paymentDate(nowStr)
                .clearanceStatus("CLEARED")
                .build();
        collectionRepository.save(collection);

        // 3. Credit property owner settlement balance
        String ownerId = (prop != null && prop.getOwnerId() != null) ? prop.getOwnerId() : "OWN-501";
        String ownerName = "Property Owner";
        String ownerPhone = null;
        Optional<User> uOpt = userRepository.findByUserId(ownerId);
        if (uOpt.isPresent()) {
            ownerName = uOpt.get().getName();
            ownerPhone = uOpt.get().getPhone();
        }
        
        Double amount = dto.getAmount() != null ? dto.getAmount() : 0.0;
        Double platformFee = amount * 0.20;
        Double ownerNetShare = amount - platformFee;

        OwnerSettlement settlement = OwnerSettlement.builder()
                .settlementId("SET-" + (1000 + (System.currentTimeMillis() % 90000)))
                .ownerId(ownerId)
                .ownerName(ownerName)
                .ownerPhone(ownerPhone)
                .propertyId(dto.getPropertyId())
                .propertyTitle(prop != null ? prop.getTitle() : "Rental Property")
                .billingPeriod(targetDue != null ? targetDue.getDueMonth() : "Monthly Rental")
                .amount(amount)
                .entitledAmount(ownerNetShare)
                .commissionFee(platformFee)
                .disbursed(0.0)
                .remaining(ownerNetShare)
                .status("AVAILABLE_FOR_WITHDRAWAL")
                .bankName("Designated Bank Account")
                .type("RENTAL_INCOME")
                .requestDate(nowStr)
                .clearanceDate("Available for Withdrawal")
                .build();
        settlementRepository.save(settlement);

        return savedPayment;
    }

    @Override
    public List<Payment> getPaymentsByTenant(String tenantId) {
        return paymentRepository.findByTenantId(tenantId);
    }

    @Override
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction " + transactionId + " not found."));
    }

    @Override
    @Transactional
    public Payment processIncomingTenantPayment(Long bookingId, Double amount, String gatewayTxnId, String ownerId) {
        Payment payment = Payment.builder()
                .transactionId("ESC-" + (System.currentTimeMillis() % 1000000))
                .propertyId("REF-" + bookingId)
                .tenantId("TENANT-ESCROW")
                .amount(amount)
                .paymentType("BOOKING_ESCROW")
                .paymentMethod("GATEWAY")
                .status("COMPLETED")
                .paymentDate(LocalDate.now())
                .gatewayTransactionId(gatewayTxnId)
                .escrowStatus(Payment.EscrowStatus.HELD_IN_ESCROW)
                .releaseEligibleDate(LocalDateTime.now().plusHours(24))
                .ownerId(ownerId)
                .build();
        return paymentRepository.save(payment);
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void processMaturedEscrowPayments() {
        List<Payment> maturedPayments = paymentRepository.findByEscrowStatusAndReleaseEligibleDateBefore(
                Payment.EscrowStatus.HELD_IN_ESCROW, LocalDateTime.now());
        for (Payment payment : maturedPayments) {
            executeFundRelease(payment);
        }
    }

    @Override
    @Transactional
    public void adminApproveAndReleaseInstantly(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        if (payment.getEscrowStatus() != Payment.EscrowStatus.HELD_IN_ESCROW) {
            throw new RuntimeException("Payment is not currently held in escrow.");
        }
        executeFundRelease(payment);
    }

    private void executeFundRelease(Payment payment) {
        payment.setEscrowStatus(Payment.EscrowStatus.RELEASED);
        paymentRepository.save(payment);

        Double platformFee = payment.getAmount() * 0.20; 
        Double ownerNetShare = payment.getAmount() - platformFee;

        OwnerSettlement settlement = OwnerSettlement.builder()
                .settlementId("SET-ESC-" + (System.currentTimeMillis() % 100000))
                .ownerId(payment.getOwnerId() != null ? payment.getOwnerId() : "OWNER-UNKNOWN")
                .bookingId(payment.getId())
                .amount(payment.getAmount())
                .entitledAmount(ownerNetShare)
                .commissionFee(platformFee)
                .status("AVAILABLE_FOR_WITHDRAWAL")
                .createdAt(LocalDateTime.now())
                .type("ESCROW_RELEASE")
                .propertyId(payment.getPropertyId())
                .ownerName("Owner")
                .billingPeriod("Instant Release")
                .build();
        settlementRepository.save(settlement);
    }
}