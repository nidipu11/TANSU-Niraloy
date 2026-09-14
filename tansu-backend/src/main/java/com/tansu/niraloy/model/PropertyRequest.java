package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "property_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String requestId; // e.g. REQ-10045

    @Column(nullable = false, length = 50)
    private String propertyId;

    @Column(nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 100)
    private String tenantName;

    @Column(length = 20)
    private String tenantPhone;

    @Column(name = "tenant_email", length = 100)
    private String tenantEmail;

    @Column(nullable = false, length = 30)
    private String requestType; // RENT_REQUEST, BUY_REQUEST, VISIT_SCHEDULE

    @Column(length = 50)
    private String preferredDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING"; // PENDING, ESCORT_ASSIGNED, APPROVED, REJECTED

    @Column(name = "escort_officer", length = 100)
    private String escortOfficer; // Assigned intermediary authority officer

    @Column(name = "request_date")
    private LocalDate requestDate;

    @PrePersist
    protected void onCreate() {
        if (this.requestDate == null) this.requestDate = LocalDate.now();
        if (this.requestId == null || this.requestId.isEmpty()) {
            this.requestId = "REQ-" + System.currentTimeMillis() % 100000;
        }
    }
}
