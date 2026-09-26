package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "operating_expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatingExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String expenseId;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 50)
    private String voucher;

    @Column(length = 50)
    @Builder.Default
    private String recordedBy = "ADM-001";

    @Column(length = 50)
    private String date;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.expenseId == null || this.expenseId.isEmpty()) {
            this.expenseId = "EXP-" + (System.currentTimeMillis() % 10000);
        }
    }
}
