package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.PropertyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRequestRepository extends JpaRepository<PropertyRequest, Long> {
    Optional<PropertyRequest> findByRequestId(String requestId);
    List<PropertyRequest> findByTenantId(String tenantId);
    List<PropertyRequest> findByTenantEmail(String tenantEmail);
    List<PropertyRequest> findByTenantIdOrTenantEmail(String tenantId, String tenantEmail);
    List<PropertyRequest> findByPropertyId(String propertyId);
    List<PropertyRequest> findByStatus(String status);
}
