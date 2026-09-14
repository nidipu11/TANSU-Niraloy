package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.PropertyDto;
import com.tansu.niraloy.model.Property;
import com.tansu.niraloy.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    /**
     * Search & Filter Properties or filter by status / ownerId
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Property>>> getProperties(
            @RequestParam(required = false, defaultValue = "ALL") String location,
            @RequestParam(required = false, defaultValue = "ALL") String propertyType,
            @RequestParam(required = false, defaultValue = "ALL") String purpose,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ownerId
    ) {
        if ("PENDING".equalsIgnoreCase(status) || "PENDING_VERIFICATION".equalsIgnoreCase(status)) {
            List<Property> pending = propertyService.getPendingProperties();
            return ResponseEntity.ok(ApiResponse.ok(pending.size(), pending));
        }
        if (ownerId != null && !ownerId.trim().isEmpty()) {
            List<Property> ownerProps = propertyService.getPropertiesByOwner(ownerId.trim());
            return ResponseEntity.ok(ApiResponse.ok(ownerProps.size(), ownerProps));
        }

        List<Property> list = propertyService.searchProperties(location, propertyType, purpose, maxPrice, bedrooms);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    /**
     * Admin Verification Queue: Get all pending listings
     */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<Property>>> getPendingProperties() {
        List<Property> pending = propertyService.getPendingProperties();
        return ResponseEntity.ok(ApiResponse.ok(pending.size(), pending));
    }

    /**
     * Owner adds a new property listing (defaults to status = PENDING)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Property>> createProperty(@Valid @RequestBody PropertyDto.CreatePropertyRequest request) {
        try {
            Property created = propertyService.createProperty(request);
            return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                    .body(ApiResponse.ok("Property submitted to TANSU Admin for verification.", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Admin Approve Property Listing
     */
    @PutMapping("/{propertyId}/approve")
    public ResponseEntity<ApiResponse<Property>> approveProperty(@PathVariable String propertyId) {
        try {
            Property approved = propertyService.approveProperty(propertyId);
            return ResponseEntity.ok(ApiResponse.ok("Property " + propertyId + " approved and published.", approved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{propertyId}/approve")
    public ResponseEntity<ApiResponse<Property>> approvePropertyPost(@PathVariable String propertyId) {
        return approveProperty(propertyId);
    }

    /**
     * Admin Reject Property Listing
     */
    @PutMapping("/{propertyId}/reject")
    public ResponseEntity<ApiResponse<Property>> rejectProperty(@PathVariable String propertyId) {
        try {
            Property rejected = propertyService.rejectProperty(propertyId);
            return ResponseEntity.ok(ApiResponse.ok("Property " + propertyId + " rejected.", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{propertyId}/reject")
    public ResponseEntity<ApiResponse<Property>> rejectPropertyPost(@PathVariable String propertyId) {
        return rejectProperty(propertyId);
    }

    /**
     * Get Single Property by Business PropertyId (e.g. PROP-GLS-01)
     */
    @GetMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Property>> getPropertyById(@PathVariable String propertyId) {
        try {
            Property prop = propertyService.getPropertyById(propertyId);
            return ResponseEntity.ok(ApiResponse.ok(prop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Update Property Details
     */
    @PutMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Property>> updateProperty(
            @PathVariable String propertyId,
            @RequestBody PropertyDto.UpdatePropertyRequest request
    ) {
        try {
            Property updated = propertyService.updateProperty(propertyId, request);
            return ResponseEntity.ok(ApiResponse.ok("Property updated successfully.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Delete Property
     */
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable String propertyId) {
        try {
            propertyService.deleteProperty(propertyId);
            return ResponseEntity.ok(ApiResponse.ok("Property deleted.", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
