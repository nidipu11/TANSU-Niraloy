package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "owner_settlements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String settlementId;

    @Column(nullable = false, length = 50)
    private String ownerId;

    @Column(nullable = false, length = 100)
    private String ownerName;

    @Column(length = 30)
    private String ownerPhone;

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 150)
    private String propertyTitle;

    @Column(nullable = false, length = 50)
    private String billingPeriod;

    @Column(nullable = false)
    private Double entitledAmount;

    @Column(nullable = false)
    @Builder.Default
    private Double disbursed = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double remaining = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double commissionFee = 0.0;

    @Column(length = 30)
    @Builder.Default
    private String status = "PENDING_CLEARANCE";

    @Column(length = 50)
    private String clearanceDate;

    @Column(length = 100)
    private String bankName;

    @Column(length = 50)
    private String type;

    @Column(length = 50)
    private String requestDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.settlementId == null || this.settlementId.isEmpty()) {
            this.settlementId = "SET-" + (System.currentTimeMillis() % 10000);
        }
    }
}
