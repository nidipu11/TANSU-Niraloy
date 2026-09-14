package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenant_collections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String collectionId;

    @Column(nullable = false, length = 50)
    private String transactionId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 100)
    private String tenantName;

    @Column(length = 30)
    private String tenantPhone;

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 150)
    private String flatTitle;

    @Column(length = 100)
    private String location;

    @Column(length = 30)
    @Builder.Default
    private String purpose = "RENT";

    @Column(nullable = false, length = 50)
    private String rentMonth;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @Column(length = 50)
    private String paymentDate;

    @Column(length = 30)
    @Builder.Default
    private String clearanceStatus = "CLEARED";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.collectionId == null || this.collectionId.isEmpty()) {
            this.collectionId = "COL-" + (System.currentTimeMillis() % 10000);
        }
    }
}
