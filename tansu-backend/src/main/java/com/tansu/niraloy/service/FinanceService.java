package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.FinanceDto;
import com.tansu.niraloy.model.*;
import java.util.List;

public interface FinanceService {
    List<TenantCollection> getAllCollections(String search);
    TenantCollection getCollectionById(String collectionId);

    List<TenantDue> getAllDues(String status);
    TenantDue getDueById(String dueId);
    List<TenantDue> getDuesByTenant(String tenantId);

    RecoveryNotice dispatchNotice(FinanceDto.CreateNoticeRequest req);
    List<RecoveryNotice> getAllNotices();
    List<RecoveryNotice> getNoticesByTenant(String tenantId);

    List<OwnerSettlement> getAllSettlements();
    OwnerSettlement approveSettlement(String settlementId);
    List<OwnerSettlement> getSettlementsByOwner(String ownerId);

    List<OperatingExpense> getAllExpenses();
    OperatingExpense recordExpense(FinanceDto.CreateExpenseRequest req);

    FinanceDto.FinanceMetrics getFinanceMetrics();
}
