package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.TenantDue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenantDueRepository extends JpaRepository<TenantDue, Long> {
    Optional<TenantDue> findByDueId(String dueId);
    List<TenantDue> findByTenantId(String tenantId);
    List<TenantDue> findByTenantEmail(String tenantEmail);
    List<TenantDue> findByTenantIdOrTenantEmail(String tenantId, String tenantEmail);
    List<TenantDue> findByStatus(String status);
    List<TenantDue> findAllByOrderByDaysOverdueDesc();
}
