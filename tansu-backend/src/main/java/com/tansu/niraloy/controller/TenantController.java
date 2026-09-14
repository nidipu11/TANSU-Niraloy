package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.PaymentDto;
import com.tansu.niraloy.dto.PropertyRequestDto;
import com.tansu.niraloy.dto.SupportTicketDto;
import com.tansu.niraloy.model.Payment;
import com.tansu.niraloy.model.PropertyRequest;
import com.tansu.niraloy.model.SupportTicket;
import com.tansu.niraloy.model.TenantDue;
import com.tansu.niraloy.model.User;
import com.tansu.niraloy.repository.TenantDueRepository;
import com.tansu.niraloy.repository.UserRepository;
import com.tansu.niraloy.service.PaymentService;
import com.tansu.niraloy.service.PropertyRequestService;
import com.tansu.niraloy.service.SupportTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/tenant")
@RequiredArgsConstructor
public class TenantController {

    private final PropertyRequestService requestService;
    private final PaymentService paymentService;
    private final SupportTicketService ticketService;
    private final TenantDueRepository dueRepository;
    private final UserRepository userRepository;

    // --- Property Requests (Rent, Buy, Visit Schedule) ---
    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<PropertyRequest>> submitRequest(@Valid @RequestBody PropertyRequestDto dto) {
        try {
            PropertyRequest req = requestService.submitRequest(dto);
            return ResponseEntity.ok(ApiResponse.ok("Request received by TANSU Niraloy Intermediary Desk.", req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<PropertyRequest>>> getTenantRequests(
            @RequestParam(required = false) String tenantId,
            @RequestParam(required = false) String email
    ) {
        String identifier = tenantId != null && !tenantId.isEmpty() ? tenantId : email;
        if (identifier == null || identifier.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(0, List.of()));
        }
        List<PropertyRequest> list = requestService.getRequestsByUser(identifier);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    // --- Outstanding Dues & Invoices ---
    @GetMapping("/dues")
    public ResponseEntity<ApiResponse<List<TenantDue>>> getTenantDues(
            @RequestParam(required = false) String tenantId,
            @RequestParam(required = false) String email
    ) {
        String identifier = (tenantId != null && !tenantId.trim().isEmpty()) ? tenantId.trim() : email;
        if (identifier == null || identifier.trim().isEmpty()) {
            List<TenantDue> all = dueRepository.findAllByOrderByDaysOverdueDesc();
            return ResponseEntity.ok(ApiResponse.ok(all.size(), all));
        }

        String searchId = identifier.trim();
        String searchEmail = searchId;
        if (!searchId.contains("@")) {
            Optional<User> uOpt = userRepository.findByUserId(searchId);
            if (uOpt.isPresent()) {
                searchEmail = uOpt.get().getEmail();
            }
        }
        List<TenantDue> list = dueRepository.findByTenantIdOrTenantEmail(searchId, searchEmail);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @GetMapping("/dues/user/{userId}")
    public ResponseEntity<ApiResponse<List<TenantDue>>> getTenantDuesByUser(@PathVariable String userId) {
        return getTenantDues(userId, userId);
    }

    // --- Payments & Escrow ---
    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<Payment>> processPayment(@Valid @RequestBody PaymentDto dto) {
        try {
            Payment payment = paymentService.processPayment(dto);
            return ResponseEntity.ok(ApiResponse.ok("Payment processed and deposited into TANSU Escrow Account.", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getTenantPayments(@RequestParam(required = false) String tenantId) {
        if (tenantId == null || tenantId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(0, List.of()));
        }
        List<Payment> list = paymentService.getPaymentsByTenant(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    // --- Support & Dispute Tickets ---
    @PostMapping("/support")
    public ResponseEntity<ApiResponse<SupportTicket>> createSupportTicket(@Valid @RequestBody SupportTicketDto dto) {
        try {
            SupportTicket ticket = ticketService.createTicket(dto);
            return ResponseEntity.ok(ApiResponse.ok("Support ticket submitted to Admin.", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/support")
    public ResponseEntity<ApiResponse<List<SupportTicket>>> getTenantTickets(@RequestParam(required = false) String tenantId) {
        if (tenantId == null || tenantId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(0, List.of()));
        }
        List<SupportTicket> list = ticketService.getTicketsByTenant(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }
}
