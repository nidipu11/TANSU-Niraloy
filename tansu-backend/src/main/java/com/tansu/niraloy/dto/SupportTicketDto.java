package com.tansu.niraloy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupportTicketDto {
    @NotBlank(message = "Tenant ID is required")
    private String tenantId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Message details are required")
    private String message;
}
