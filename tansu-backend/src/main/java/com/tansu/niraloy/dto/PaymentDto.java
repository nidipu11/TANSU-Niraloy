package com.tansu.niraloy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentDto {
    @NotBlank(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Tenant ID is required")
    private String tenantId;

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotBlank(message = "Payment type is required")
    private String paymentType;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String dueId;

    private String transactionId;
}
