package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    Optional<Property> findByPropertyId(String propertyId);

    List<Property> findByOwnerId(String ownerId);

    List<Property> findByOwnerIdOrderByCreatedAtDesc(String ownerId);

    List<Property> findByVerificationStatus(String verificationStatus);

    List<Property> findByStatus(String status);

    List<Property> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT p FROM Property p WHERE " +
           "(p.status = 'APPROVED' OR p.verificationStatus = 'VERIFIED') AND " +
           "(:location IS NULL OR :location = 'ALL' OR LOWER(p.location) = LOWER(:location)) AND " +
           "(:propertyType IS NULL OR :propertyType = 'ALL' OR p.propertyType = :propertyType) AND " +
           "(:purpose IS NULL OR :purpose = 'ALL' OR p.purpose = :purpose) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) " +
           "ORDER BY p.createdAt DESC")
    List<Property> searchProperties(
            @Param("location") String location,
            @Param("propertyType") String propertyType,
            @Param("purpose") String purpose,
            @Param("maxPrice") Double maxPrice,
            @Param("bedrooms") Integer bedrooms
    );
}
