package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.OwnerSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerSettlementRepository extends JpaRepository<OwnerSettlement, Long> {
    Optional<OwnerSettlement> findBySettlementId(String settlementId);
    List<OwnerSettlement> findByOwnerId(String ownerId);
    List<OwnerSettlement> findByStatus(String status);
    List<OwnerSettlement> findAllByOrderByCreatedAtDesc();
}
