package com.tansu.niraloy.dto;

import lombok.*;
import java.util.List;

public class FinanceDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateNoticeRequest {
        private String dueId;
        private String tenantId;
        private String tenantName;
        private String tenantPhone;
        private String propertyId;
        private Double dueAmount;
        private String noticeType;
        private List<String> channels;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateExpenseRequest {
        private String category;
        private String description;
        private Double amount;
        private String date;
        private String recordedBy;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveSettlementRequest {
        private String settlementId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FinanceMetrics {
        private Double totalCollected;
        private Double totalDue;
        private Long overdueCount;
        private Double totalDisbursed;
        private Double totalExpenses;
    }
}
