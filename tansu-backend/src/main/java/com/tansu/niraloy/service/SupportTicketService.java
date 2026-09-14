package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.SupportTicketDto;
import com.tansu.niraloy.model.SupportTicket;
import java.util.List;

public interface SupportTicketService {
    SupportTicket createTicket(SupportTicketDto dto);
    List<SupportTicket> getTicketsByTenant(String tenantId);
    List<SupportTicket> getAllTickets();
    SupportTicket updateTicketStatus(String supportId, String status);
}
