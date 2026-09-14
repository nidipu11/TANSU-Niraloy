package com.tansu.niraloy.config;

import com.tansu.niraloy.model.Property;
import com.tansu.niraloy.model.Role;
import com.tansu.niraloy.model.User;
import com.tansu.niraloy.repository.PropertyRepository;
import com.tansu.niraloy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @Override
    public void run(String... args) {
        // Seed default users if empty
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .userId("ADM-001")
                    .name("TANSU System Administrator")
                    .email("admin@tansu.gov.bd")
                    .password("Admin123")
                    .phone("01700000000")
                    .role(Role.ADMIN)
                    .build();

            User owner = User.builder()
                    .userId("OWN-501")
                    .name("Haji Mohammad Rafiq")
                    .email("property.owner@gmail.com")
                    .password("Owner123")
                    .phone("01711223344")
                    .role(Role.OWNER)
                    .build();

            User tenant = User.builder()
                    .userId("TNT-101")
                    .name("Shakil Ahmed")
                    .email("student.tenant@gmail.com")
                    .password("Tenant123")
                    .phone("01811223344")
                    .role(Role.TENANT)
                    .build();

            userRepository.saveAll(List.of(admin, owner, tenant));
            System.out.println(">>> Seeded default users (Admin, Owner, Tenant).");
        }

        // Seed initial verified properties if empty
        if (propertyRepository.count() == 0) {
            Property p1 = Property.builder()
                    .propertyId("PROP-GLS-01")
                    .ownerId("OWN-501")
                    .title("Luxury 3-BHK Lakeview Apartment in Gulshan-2")
                    .location("Gulshan")
                    .propertyType("PREMIUM_FAMILY_HOUSING")
                    .purpose("RENT")
                    .price(95000.0)
                    .area(2550)
                    .bedrooms(3)
                    .bathrooms(4)
                    .amenities(List.of("Lake View", "Elevator", "24/7 Generator", "Gym", "Car Parking", "Security Guard", "CCTV", "Balcony"))
                    .description("Serene lakeside residence on Road 71, Gulshan-2. Imported Turkish marble, soundproof glass, and 2 parking slots.")
                    .images(List.of("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000"))
                    .status("APPROVED")
                    .verificationStatus("VERIFIED")
                    .availabilityStatus("AVAILABLE_FOR_RENT")
                    .submissionDate(LocalDate.now())
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build();

            Property p2 = Property.builder()
                    .propertyId("PROP-BSH-01")
                    .ownerId("OWN-501")
                    .title("Exclusive Brand New Flat for Sale in Block I")
                    .location("Bashundhara")
                    .propertyType("FLAT_SALE")
                    .purpose("SALE")
                    .price(18500000.0)
                    .area(2150)
                    .bedrooms(4)
                    .bathrooms(4)
                    .amenities(List.of("RAJUK Approved", "2 Car Parking", "Community Hall", "Substation", "Swimming Pool"))
                    .description("Brand new south-facing luxury apartment in Block I, Bashundhara R/A. Ready for registration with title vetted.")
                    .images(List.of("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000"))
                    .status("APPROVED")
                    .verificationStatus("VERIFIED")
                    .availabilityStatus("AVAILABLE_FOR_SALE")
                    .submissionDate(LocalDate.now())
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build();

            Property p3 = Property.builder()
                    .propertyId("PROP-MIR-01")
                    .ownerId("OWN-501")
                    .title("Student & Executive Bachelor Flat in Mirpur DOHS")
                    .location("Mirpur")
                    .propertyType("BACHELOR_HOUSE")
                    .purpose("RENT")
                    .price(18000.0)
                    .area(1150)
                    .bedrooms(2)
                    .bathrooms(2)
                    .amenities(List.of("High Speed WiFi", "Security Guard", "Elevator", "Generator Backup"))
                    .description("Secure accommodation inside Mirpur DOHS. Ideal for university students and corporate bachelors.")
                    .images(List.of("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000", "https://images.unsplash.com/photo-1502005229762-ee152da92e06?w=1000"))
                    .status("APPROVED")
                    .verificationStatus("VERIFIED")
                    .availabilityStatus("AVAILABLE_FOR_RENT")
                    .submissionDate(LocalDate.now())
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build();

            propertyRepository.saveAll(List.of(p1, p2, p3));
            System.out.println(">>> Seeded initial verified Dhaka properties into database.");
        }
    }
}
