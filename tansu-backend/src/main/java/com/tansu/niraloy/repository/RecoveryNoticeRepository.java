package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.RecoveryNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecoveryNoticeRepository extends JpaRepository<RecoveryNotice, Long> {
    List<RecoveryNotice> findByTenantId(String tenantId);
    List<RecoveryNotice> findByDueId(String dueId);
    List<RecoveryNotice> findAllByOrderByCreatedAtDesc();
}
