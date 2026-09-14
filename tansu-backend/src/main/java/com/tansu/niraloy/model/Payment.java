package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String transactionId; // e.g. TN-TXN-98431

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 50)
    private String paymentType; // RENT_ADVANCE, BOOKING_ESCROW, FULL_SETTLEMENT

    @Column(nullable = false, length = 50)
    private String paymentMethod; // BKASH, NAGAD, BANK_TRANSFER, CARDS

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "COMPLETED"; // PENDING, COMPLETED, REFUNDED

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @PrePersist
    protected void onCreate() {
        if (this.paymentDate == null) this.paymentDate = LocalDate.now();
        if (this.transactionId == null || this.transactionId.isEmpty()) {
            this.transactionId = "TN-TXN-" + System.currentTimeMillis() % 1000000;
        }
    }
}
