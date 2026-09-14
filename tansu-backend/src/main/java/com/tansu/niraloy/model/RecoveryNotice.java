package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_notices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecoveryNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String noticeId;

    @Column(nullable = false, length = 50)
    private String dueId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 100)
    private String tenantName;

    @Column(length = 30)
    private String tenantPhone;

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false)
    private Double dueAmount;

    @Column(nullable = false, length = 100)
    private String noticeType;

    @Column(length = 150)
    private String channels;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(length = 50)
    private String sentAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.noticeId == null || this.noticeId.isEmpty()) {
            this.noticeId = "NOT-" + (System.currentTimeMillis() % 10000);
        }
        if (this.sentAt == null || this.sentAt.isEmpty()) {
            this.sentAt = LocalDateTime.now().toString();
        }
    }
}
