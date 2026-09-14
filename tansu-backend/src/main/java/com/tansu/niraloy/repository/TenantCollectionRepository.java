package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.TenantCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenantCollectionRepository extends JpaRepository<TenantCollection, Long> {
    Optional<TenantCollection> findByCollectionId(String collectionId);
    List<TenantCollection> findByTenantId(String tenantId);
    List<TenantCollection> findByPropertyId(String propertyId);
    List<TenantCollection> findAllByOrderByCreatedAtDesc();
}
