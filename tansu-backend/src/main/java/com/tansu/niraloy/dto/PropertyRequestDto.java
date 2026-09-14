package com.tansu.niraloy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PropertyRequestDto {
    @NotBlank(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Tenant ID is required")
    private String tenantId;

    private String tenantName;

    private String tenantEmail;

    private String tenantPhone;

    @NotBlank(message = "Request type is required (RENT_REQUEST, BUY_REQUEST, VISIT_SCHEDULE)")
    private String requestType;

    private String preferredDate;
    private String preferredTime;
    private String notes;
    private String message;
}
