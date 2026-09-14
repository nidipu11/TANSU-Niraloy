package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String propertyId; // e.g. PROP-GLS-01

    @Column(nullable = false, length = 50)
    private String ownerId; // Foreign reference to owner userId

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String location; // Gulshan, Banani, Dhanmondi, etc.

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType; // FAMILY_HOUSE, BACHELOR_HOUSE, FLAT_SALE, PREMIUM_FAMILY_HOUSING

    @Column(nullable = false, length = 20)
    private String purpose; // RENT, SALE

    @Column(nullable = false)
    private Double price;

    private Integer area; // sqft
    private Integer bedrooms;
    private Integer bathrooms;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", length = 500)
    private List<String> images;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "APPROVED"; // PENDING, APPROVED, REJECTED

    @Column(name = "verification_status", length = 30)
    @Builder.Default
    private String verificationStatus = "VERIFIED"; // PENDING_VERIFICATION, VERIFIED, REJECTED

    @Column(name = "availability_status", length = 30)
    @Builder.Default
    private String availabilityStatus = "AVAILABLE_FOR_RENT"; // AVAILABLE_FOR_RENT, AVAILABLE_FOR_SALE, RENTED, SOLD

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDate.now();
        if (this.updatedAt == null) this.updatedAt = LocalDate.now();
        if (this.submissionDate == null) this.submissionDate = this.createdAt;
        if (this.status == null || this.status.isEmpty()) {
            if ("PENDING_VERIFICATION".equalsIgnoreCase(this.verificationStatus) || "PENDING".equalsIgnoreCase(this.verificationStatus)) {
                this.status = "PENDING";
            } else if ("REJECTED".equalsIgnoreCase(this.verificationStatus)) {
                this.status = "REJECTED";
            } else {
                this.status = "APPROVED";
            }
        }
        if (this.verificationStatus == null || this.verificationStatus.isEmpty()) {
            if ("PENDING".equalsIgnoreCase(this.status)) {
                this.verificationStatus = "PENDING_VERIFICATION";
            } else if ("REJECTED".equalsIgnoreCase(this.status)) {
                this.verificationStatus = "REJECTED";
            } else {
                this.verificationStatus = "VERIFIED";
            }
        }
        if (this.propertyId == null || this.propertyId.isEmpty()) {
            this.propertyId = "PROP-" + (1000 + (System.currentTimeMillis() % 90000));
        }
    }

    @PostLoad
    protected void onPostLoad() {
        if (this.status == null || this.status.isEmpty()) {
            if ("PENDING_VERIFICATION".equalsIgnoreCase(this.verificationStatus) || "PENDING".equalsIgnoreCase(this.verificationStatus)) {
                this.status = "PENDING";
            } else if ("REJECTED".equalsIgnoreCase(this.verificationStatus)) {
                this.status = "REJECTED";
            } else {
                this.status = "APPROVED";
            }
        }
        if (this.submissionDate == null) {
            this.submissionDate = this.createdAt != null ? this.createdAt : LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }
}
