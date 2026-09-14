package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.PropertyDto;
import com.tansu.niraloy.model.OwnerSettlement;
import com.tansu.niraloy.model.Property;
import com.tansu.niraloy.model.User;
import com.tansu.niraloy.repository.OwnerSettlementRepository;
import com.tansu.niraloy.repository.UserRepository;
import com.tansu.niraloy.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final PropertyService propertyService;
    private final OwnerSettlementRepository settlementRepository;
    private final UserRepository userRepository;

    /**
     * Add new property listing (Requires Admin Verification before going public)
     */
    @PostMapping("/properties")
    public ResponseEntity<ApiResponse<Property>> createProperty(@Valid @RequestBody PropertyDto.CreatePropertyRequest request) {
        try {
            Property created = propertyService.createProperty(request);
            return ResponseEntity.ok(ApiResponse.ok("Property submitted to TANSU Admin for verification.", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get all listings submitted by owner
     */
    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<List<Property>>> getOwnerProperties(@RequestParam(required = false) String ownerId) {
        if (ownerId == null || ownerId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(0, List.of()));
        }
        List<Property> list = propertyService.getPropertiesByOwner(ownerId);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    /**
     * Get settlements & earnings for owner
     */
    @GetMapping({"/settlements", "/earnings"})
    public ResponseEntity<ApiResponse<List<OwnerSettlement>>> getOwnerSettlements(@RequestParam(required = false) String ownerId) {
        if (ownerId == null || ownerId.trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(0, List.of()));
        }
        List<OwnerSettlement> list = settlementRepository.findByOwnerId(ownerId.trim());
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    /**
     * Submit withdrawal request to Admin
     */
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<OwnerSettlement>> submitWithdrawal(@RequestBody Map<String, Object> body) {
        try {
            String ownerId = (String) body.get("ownerId");
            Double amount = Double.valueOf(String.valueOf(body.get("amount")));
            String payoutMethod = (String) body.getOrDefault("payoutMethod", "Bank Transfer");
            String note = (String) body.getOrDefault("note", "Owner Earnings Withdrawal");

            String ownerName = "Property Owner";
            String ownerPhone = null;
            if (ownerId != null) {
                Optional<User> uOpt = userRepository.findByUserId(ownerId);
                if (uOpt.isPresent()) {
                    ownerName = uOpt.get().getName();
                    ownerPhone = uOpt.get().getPhone();
                }
            }

            String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

            OwnerSettlement withdrawal = OwnerSettlement.builder()
                    .settlementId("WDR-" + (1000 + (System.currentTimeMillis() % 90000)))
                    .ownerId(ownerId)
                    .ownerName(ownerName)
                    .ownerPhone(ownerPhone)
                    .propertyId("PORTFOLIO")
                    .propertyTitle(note)
                    .billingPeriod(nowStr)
                    .entitledAmount(amount)
                    .disbursed(0.0)
                    .remaining(amount)
                    .status("PENDING_ADMIN_APPROVAL")
                    .type("WITHDRAWAL_REQUEST")
                    .bankName(payoutMethod)
                    .requestDate(nowStr)
                    .clearanceDate("Awaiting Admin Clearance")
                    .build();

            OwnerSettlement saved = settlementRepository.save(withdrawal);
            return ResponseEntity.ok(ApiResponse.ok("Withdrawal request submitted to TANSU Admin.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to submit withdrawal: " + e.getMessage()));
        }
    }
}
