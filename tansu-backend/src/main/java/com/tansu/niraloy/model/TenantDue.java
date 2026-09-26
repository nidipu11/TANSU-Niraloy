package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenant_dues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String dueId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 100)
    private String tenantName;

    @Column(length = 30)
    private String tenantPhone;

    @Column(length = 100)
    private String tenantEmail;

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 150)
    private String flatTitle;

    @Column(length = 100)
    private String location;

    @Column(nullable = false, length = 50)
    private String dueMonth;

    @Column
    private Double rentAmount;

    @Column
    private Double utilityCharge;

    @Column(nullable = false)
    private Double totalBilled;

    @Column(nullable = false)
    @Builder.Default
    private Double paidAmount = 0.0;

    @Column(nullable = false)
    private Double dueAmount;

    @Column(length = 50)
    private String dueDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer daysOverdue = 0;

    @Column(length = 30)
    @Builder.Default
    private String status = "OVERDUE";

    @Column(nullable = false)
    @Builder.Default
    private Boolean noticeSent = false;

    @Column(length = 50)
    private String lastNoticeDate;

    @Column(length = 100)
    private String lastNoticeType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.dueId == null || this.dueId.isEmpty()) {
            this.dueId = "DUE-" + (System.currentTimeMillis() % 10000);
        }
    }
}
