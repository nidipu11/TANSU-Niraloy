package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.PropertyRequestDto;
import com.tansu.niraloy.model.PropertyRequest;
import com.tansu.niraloy.service.PropertyRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class PropertyRequestController {

    private final PropertyRequestService requestService;

    /**
     * Submit a new property request (Rent, Buy, Visit)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyRequest>> submitRequest(@Valid @RequestBody PropertyRequestDto dto) {
        try {
            PropertyRequest req = requestService.submitRequest(dto);
            return ResponseEntity.ok(ApiResponse.ok("Request received by TANSU Niraloy Intermediary Desk.", req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Fetch requests specifically for the logged-in user by userId or email
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PropertyRequest>>> getRequestsByUser(@PathVariable String userId) {
        try {
            List<PropertyRequest> list = requestService.getRequestsByUser(userId);
            return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get all requests or filter by userId/email/tenantId
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyRequest>>> getAllRequests(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String tenantId,
            @RequestParam(required = false) String email
    ) {
        String queryUser = userId != null ? userId : (tenantId != null ? tenantId : email);
        if (queryUser != null && !queryUser.trim().isEmpty()) {
            List<PropertyRequest> list = requestService.getRequestsByUser(queryUser.trim());
            return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
        }
        List<PropertyRequest> list = requestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    /**
     * Admin Approve Request: PUT /api/requests/{id}/approve
     * Automatically generates a record in tenant_dues and marks property as RENTED.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<PropertyRequest>> approveRequest(@PathVariable String id) {
        try {
            PropertyRequest approved = requestService.approveRequest(id);
            return ResponseEntity.ok(ApiResponse.ok("Request " + id + " approved and tenant dues generated successfully.", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to approve request: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<PropertyRequest>> approveRequestPost(@PathVariable String id) {
        return approveRequest(id);
    }

    /**
     * Admin Reject Request: PUT /api/requests/{id}/reject
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<PropertyRequest>> rejectRequest(@PathVariable String id) {
        try {
            PropertyRequest rejected = requestService.rejectRequest(id);
            return ResponseEntity.ok(ApiResponse.ok("Request " + id + " rejected.", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to reject request: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<PropertyRequest>> rejectRequestPost(@PathVariable String id) {
        return rejectRequest(id);
    }

    /**
     * Update request status or assign escort officer
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyRequest>> updateRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");
            String escortOfficer = body.get("escortOfficer");
            if ("APPROVED".equalsIgnoreCase(status)) {
                return approveRequest(id);
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                return rejectRequest(id);
            }
            PropertyRequest updated = requestService.updateStatus(id, status, escortOfficer);
            return ResponseEntity.ok(ApiResponse.ok("Request updated.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
