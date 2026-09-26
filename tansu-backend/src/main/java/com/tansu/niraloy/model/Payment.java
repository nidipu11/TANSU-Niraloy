package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    public enum EscrowStatus {
        HELD_IN_ESCROW, RELEASED, DISPUTED, REFUNDED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String transactionId; 

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 50)
    private String paymentType; 

    @Column(nullable = false, length = 50)
    private String paymentMethod; 

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "COMPLETED"; 

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    // Escrow additions
    @Column(name = "gateway_transaction_id")
    private String gatewayTransactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "escrow_status")
    private EscrowStatus escrowStatus;

    @Column(name = "release_eligible_date")
    private LocalDateTime releaseEligibleDate;

    @Column(name = "owner_id")
    private String ownerId;

    @PrePersist
    protected void onCreate() {
        if (this.paymentDate == null) this.paymentDate = LocalDate.now();
        if (this.transactionId == null || this.transactionId.isEmpty()) {
            this.transactionId = "TN-TXN-" + System.currentTimeMillis() % 1000000;
        }
    }
}