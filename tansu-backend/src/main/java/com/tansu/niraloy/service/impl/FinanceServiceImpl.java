package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.FinanceDto;
import com.tansu.niraloy.model.*;
import com.tansu.niraloy.repository.*;
import com.tansu.niraloy.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceServiceImpl implements FinanceService {

    private final TenantCollectionRepository collectionRepository;
    private final TenantDueRepository dueRepository;
    private final RecoveryNoticeRepository noticeRepository;
    private final OwnerSettlementRepository settlementRepository;
    private final OperatingExpenseRepository expenseRepository;

    @Override
    public List<TenantCollection> getAllCollections(String search) {
        List<TenantCollection> all = collectionRepository.findAllByOrderByCreatedAtDesc();
        if (search == null || search.trim().isEmpty()) {
            return all;
        }
        String q = search.toLowerCase();
        return all.stream().filter(c ->
            (c.getTenantName() != null && c.getTenantName().toLowerCase().contains(q)) ||
            (c.getTenantId() != null && c.getTenantId().toLowerCase().contains(q)) ||
            (c.getPropertyId() != null && c.getPropertyId().toLowerCase().contains(q)) ||
            (c.getFlatTitle() != null && c.getFlatTitle().toLowerCase().contains(q)) ||
            (c.getLocation() != null && c.getLocation().toLowerCase().contains(q))
        ).collect(Collectors.toList());
    }

    @Override
    public TenantCollection getCollectionById(String collectionId) {
        return collectionRepository.findByCollectionId(collectionId)
                .orElseThrow(() -> new RuntimeException("Collection not found: " + collectionId));
    }

    @Override
    public List<TenantDue> getAllDues(String status) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return dueRepository.findByStatus(status.toUpperCase());
        }
        return dueRepository.findAllByOrderByDaysOverdueDesc();
    }

    @Override
    public TenantDue getDueById(String dueId) {
        return dueRepository.findByDueId(dueId)
                .orElseThrow(() -> new RuntimeException("Due record not found: " + dueId));
    }

    @Override
    public List<TenantDue> getDuesByTenant(String tenantId) {
        return dueRepository.findByTenantId(tenantId);
    }

    @Override
    @Transactional
    public RecoveryNotice dispatchNotice(FinanceDto.CreateNoticeRequest req) {
        String channelsStr = req.getChannels() != null ? String.join(", ", req.getChannels()) : "SMS, Portal";
        String sentTimestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        RecoveryNotice notice = RecoveryNotice.builder()
                .dueId(req.getDueId())
                .tenantId(req.getTenantId())
                .tenantName(req.getTenantName())
                .tenantPhone(req.getTenantPhone())
                .propertyId(req.getPropertyId())
                .dueAmount(req.getDueAmount())
                .noticeType(req.getNoticeType())
                .channels(channelsStr)
                .message(req.getMessage())
                .sentAt(sentTimestamp)
                .build();

        RecoveryNotice saved = noticeRepository.save(notice);

        // Update corresponding due record
        if (req.getDueId() != null) {
            dueRepository.findByDueId(req.getDueId()).ifPresent(due -> {
                due.setNoticeSent(true);
                due.setLastNoticeDate(sentTimestamp);
                due.setLastNoticeType(req.getNoticeType());
                dueRepository.save(due);
            });
        }

        return saved;
    }

    @Override
    public List<RecoveryNotice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<RecoveryNotice> getNoticesByTenant(String tenantId) {
        return noticeRepository.findByTenantId(tenantId);
    }

    @Override
    public List<OwnerSettlement> getAllSettlements() {
        return settlementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public OwnerSettlement approveSettlement(String settlementId) {
        OwnerSettlement settlement = settlementRepository.findBySettlementId(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found: " + settlementId));

        settlement.setDisbursed(settlement.getEntitledAmount());
        settlement.setRemaining(0.0);
        settlement.setStatus("SETTLED");
        settlement.setClearanceDate(LocalDate.now().toString());

        return settlementRepository.save(settlement);
    }

    @Override
    public List<OwnerSettlement> getSettlementsByOwner(String ownerId) {
        return settlementRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<OperatingExpense> getAllExpenses() {
        return expenseRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public OperatingExpense recordExpense(FinanceDto.CreateExpenseRequest req) {
        OperatingExpense expense = OperatingExpense.builder()
                .category(req.getCategory())
                .description(req.getDescription())
                .amount(req.getAmount())
                .voucher("VCH-" + (int)(1000 + Math.random() * 9000))
                .recordedBy(req.getRecordedBy() != null ? req.getRecordedBy() : "ADM-001")
                .date(req.getDate() != null ? req.getDate() : LocalDate.now().toString())
                .build();

        return expenseRepository.save(expense);
    }

    @Override
    public FinanceDto.FinanceMetrics getFinanceMetrics() {
        double totalCollected = collectionRepository.findAll().stream()
                .mapToDouble(TenantCollection::getAmount).sum();

        double totalDue = dueRepository.findAll().stream()
                .mapToDouble(TenantDue::getDueAmount).sum();

        long overdueCount = dueRepository.findAll().stream()
                .filter(d -> "OVERDUE".equalsIgnoreCase(d.getStatus())).count();

        double totalDisbursed = settlementRepository.findAll().stream()
                .mapToDouble(OwnerSettlement::getDisbursed).sum();

        double totalExpenses = expenseRepository.findAll().stream()
                .mapToDouble(OperatingExpense::getAmount).sum();

        return FinanceDto.FinanceMetrics.builder()
                .totalCollected(totalCollected)
                .totalDue(totalDue)
                .overdueCount(overdueCount)
                .totalDisbursed(totalDisbursed)
                .totalExpenses(totalExpenses)
                .build();
    }
}
