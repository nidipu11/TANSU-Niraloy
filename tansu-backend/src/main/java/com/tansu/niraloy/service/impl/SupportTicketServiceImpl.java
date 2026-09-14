package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.SupportTicketDto;
import com.tansu.niraloy.model.SupportTicket;
import com.tansu.niraloy.repository.SupportTicketRepository;
import com.tansu.niraloy.service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository ticketRepository;

    @Override
    public SupportTicket createTicket(SupportTicketDto dto) {
        SupportTicket ticket = SupportTicket.builder()
                .tenantId(dto.getTenantId())
                .subject(dto.getSubject())
                .category(dto.getCategory())
                .message(dto.getMessage())
                .status("OPEN")
                .build();

        return ticketRepository.save(ticket);
    }

    @Override
    public List<SupportTicket> getTicketsByTenant(String tenantId) {
        return ticketRepository.findByTenantId(tenantId);
    }

    @Override
    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public SupportTicket updateTicketStatus(String supportId, String status) {
        SupportTicket ticket = ticketRepository.findBySupportId(supportId)
                .orElseThrow(() -> new RuntimeException("Ticket ID " + supportId + " not found."));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}
