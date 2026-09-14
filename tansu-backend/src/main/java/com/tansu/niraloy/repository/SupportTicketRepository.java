package com.tansu.niraloy.repository;

import com.tansu.niraloy.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    Optional<SupportTicket> findBySupportId(String supportId);
    List<SupportTicket> findByTenantId(String tenantId);
    List<SupportTicket> findByStatus(String status);
}
