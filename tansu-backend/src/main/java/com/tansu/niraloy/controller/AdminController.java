package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.FinanceDto;
import com.tansu.niraloy.dto.PropertyDto;
import com.tansu.niraloy.model.*;
import com.tansu.niraloy.service.FinanceService;
import com.tansu.niraloy.service.PropertyRequestService;
import com.tansu.niraloy.service.PropertyService;
import com.tansu.niraloy.service.SupportTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PropertyService propertyService;
    private final PropertyRequestService requestService;
    private final SupportTicketService ticketService;
    private final FinanceService financeService;

    // Get listings waiting for admin verification
    @GetMapping({"/listings/pending", "/properties/pending"})
    public ResponseEntity<ApiResponse<List<Property>>> getPendingListings() {
        List<Property> pending = propertyService.getPendingProperties();
        return ResponseEntity.ok(ApiResponse.ok(pending.size(), pending));
    }

    @PutMapping({"/properties/{propertyId}/approve", "/listings/{propertyId}/approve"})
    public ResponseEntity<ApiResponse<Property>> approveListing(@PathVariable String propertyId) {
        try {
            Property approved = propertyService.approveProperty(propertyId);
            return ResponseEntity.ok(ApiResponse.ok("Property approved and published.", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping({"/properties/{propertyId}/reject", "/listings/{propertyId}/reject"})
    public ResponseEntity<ApiResponse<Property>> rejectListing(@PathVariable String propertyId) {
        try {
            Property rejected = propertyService.rejectProperty(propertyId);
            return ResponseEntity.ok(ApiResponse.ok("Property rejected.", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Verify or Reject listing
    @PutMapping("/listings/{propertyId}/verify")
    public ResponseEntity<ApiResponse<Property>> verifyListing(
            @PathVariable String propertyId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.getOrDefault("status", "VERIFIED");
            PropertyDto.UpdatePropertyRequest req = new PropertyDto.UpdatePropertyRequest();
            req.setVerificationStatus(status);
            if ("VERIFIED".equalsIgnoreCase(status) || "APPROVED".equalsIgnoreCase(status)) {
                Property existing = propertyService.getPropertyById(propertyId);
                req.setAvailabilityStatus("SALE".equalsIgnoreCase(existing.getPurpose()) ? "AVAILABLE_FOR_SALE" : "AVAILABLE_FOR_RENT");
            } else {
                req.setAvailabilityStatus("REJECTED");
            }
            Property updated = propertyService.updateProperty(propertyId, req);
            return ResponseEntity.ok(ApiResponse.ok("Listing verification updated to " + status, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Manage all tenant property requests & assign intermediary escort
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<PropertyRequest>>> getAllRequests() {
        List<PropertyRequest> list = requestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @PutMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<PropertyRequest>> updateRequestStatus(
            @PathVariable String requestId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");
            String escortOfficer = body.get("escortOfficer");
            if ("APPROVED".equalsIgnoreCase(status)) {
                PropertyRequest approved = requestService.approveRequest(requestId);
                return ResponseEntity.ok(ApiResponse.ok("Request approved and dues generated.", approved));
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                PropertyRequest rejected = requestService.rejectRequest(requestId);
                return ResponseEntity.ok(ApiResponse.ok("Request rejected.", rejected));
            }
            PropertyRequest updated = requestService.updateStatus(requestId, status, escortOfficer);
            return ResponseEntity.ok(ApiResponse.ok("Request updated.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/requests/{requestId}/approve")
    public ResponseEntity<ApiResponse<PropertyRequest>> approveRequest(@PathVariable String requestId) {
        try {
            PropertyRequest approved = requestService.approveRequest(requestId);
            return ResponseEntity.ok(ApiResponse.ok("Request approved and tenant dues generated.", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/requests/{requestId}/reject")
    public ResponseEntity<ApiResponse<PropertyRequest>> rejectRequest(@PathVariable String requestId) {
        try {
            PropertyRequest rejected = requestService.rejectRequest(requestId);
            return ResponseEntity.ok(ApiResponse.ok("Request rejected.", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // View and resolve support disputes
    @GetMapping("/support")
    public ResponseEntity<ApiResponse<List<SupportTicket>>> getAllTickets() {
        List<SupportTicket> list = ticketService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @PutMapping("/support/{supportId}/status")
    public ResponseEntity<ApiResponse<SupportTicket>> updateTicketStatus(
            @PathVariable String supportId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.getOrDefault("status", "RESOLVED");
            SupportTicket updated = ticketService.updateTicketStatus(supportId, status);
            return ResponseEntity.ok(ApiResponse.ok("Support ticket status updated.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Owner Settlements & Withdrawal Management ---
    @GetMapping("/settlements")
    public ResponseEntity<ApiResponse<List<OwnerSettlement>>> getAllSettlements() {
        List<OwnerSettlement> list = financeService.getAllSettlements();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @PostMapping("/settlements/approve")
    public ResponseEntity<ApiResponse<OwnerSettlement>> approveSettlement(@RequestBody Map<String, String> body) {
        try {
            String settlementId = body.get("settlementId");
            OwnerSettlement approved = financeService.approveSettlement(settlementId);
            return ResponseEntity.ok(ApiResponse.ok("Settlement approved and disbursed.", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Tenant Dues & Arrears Management ---
    @GetMapping("/dues")
    public ResponseEntity<ApiResponse<List<TenantDue>>> getAllDues(@RequestParam(required = false, defaultValue = "ALL") String status) {
        List<TenantDue> list = financeService.getAllDues(status);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    // --- Official Notice Dispatch ---
    @GetMapping("/notices")
    public ResponseEntity<ApiResponse<List<RecoveryNotice>>> getAllNotices() {
        List<RecoveryNotice> list = financeService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @PostMapping("/notices")
    public ResponseEntity<ApiResponse<RecoveryNotice>> dispatchNotice(@RequestBody FinanceDto.CreateNoticeRequest req) {
        try {
            RecoveryNotice notice = financeService.dispatchNotice(req);
            return ResponseEntity.ok(ApiResponse.ok("Notice dispatched successfully.", notice));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Tenant Rent Collections Ledger ---
    @GetMapping("/collections")
    public ResponseEntity<ApiResponse<List<TenantCollection>>> getAllCollections(@RequestParam(required = false) String search) {
        List<TenantCollection> list = financeService.getAllCollections(search);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    // --- System Operating Expenses ---
    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<OperatingExpense>>> getAllExpenses() {
        List<OperatingExpense> list = financeService.getAllExpenses();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @PostMapping("/expenses")
    public ResponseEntity<ApiResponse<OperatingExpense>> recordExpense(@RequestBody FinanceDto.CreateExpenseRequest req) {
        try {
            OperatingExpense expense = financeService.recordExpense(req);
            return ResponseEntity.ok(ApiResponse.ok("Expense recorded successfully.", expense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Finance KPIs & Summary Metrics ---
    @GetMapping("/finance/metrics")
    public ResponseEntity<ApiResponse<FinanceDto.FinanceMetrics>> getFinanceMetrics() {
        FinanceDto.FinanceMetrics metrics = financeService.getFinanceMetrics();
        return ResponseEntity.ok(ApiResponse.ok("Finance metrics retrieved.", metrics));
    }
}
