package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.Payment;
import com.tansu.niraloy.model.Payment.EscrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByTenantId(String tenantId);
    List<Payment> findByPropertyId(String propertyId);

    // Fetch matured escrow payments
    List<Payment> findByEscrowStatusAndReleaseEligibleDateBefore(EscrowStatus status, LocalDateTime dateTime);
}