package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.PaymentDto;
import com.tansu.niraloy.model.*;
import com.tansu.niraloy.repository.*;
import com.tansu.niraloy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .propertyId(dto.getPropertyId())
                .tenantId(dto.getTenantId())
                .amount(dto.getAmount())
                .paymentType(dto.getPaymentType())
                .paymentMethod(dto.getPaymentMethod())
                .status("COMPLETED")
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
                .paymentMethod(dto.getPaymentMethod())
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

        OwnerSettlement settlement = OwnerSettlement.builder()
                .settlementId("SET-" + (1000 + (System.currentTimeMillis() % 90000)))
                .ownerId(ownerId)
                .ownerName(ownerName)
                .ownerPhone(ownerPhone)
                .propertyId(dto.getPropertyId())
                .propertyTitle(prop != null ? prop.getTitle() : "Rental Property")
                .billingPeriod(targetDue != null ? targetDue.getDueMonth() : "September 2026")
                .entitledAmount(dto.getAmount())
                .disbursed(0.0)
                .remaining(dto.getAmount())
                .status("AVAILABLE")
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
}
