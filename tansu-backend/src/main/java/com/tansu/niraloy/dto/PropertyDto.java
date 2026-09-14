package com.tansu.niraloy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.List;

public class PropertyDto {

    @Data
    public static class CreatePropertyRequest {
        @NotBlank(message = "Owner ID is required")
        private String ownerId;

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Location is required")
        private String location;

        @NotBlank(message = "Property type is required")
        private String propertyType;

        @NotBlank(message = "Purpose (RENT or SALE) is required")
        private String purpose;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be greater than zero")
        private Double price;

        private Integer area;
        private Integer bedrooms;
        private Integer bathrooms;
        private List<String> amenities;
        private String description;
        private List<String> images;
    }

    @Data
    public static class UpdatePropertyRequest {
        private String title;
        private String location;
        private String propertyType;
        private String purpose;
        private Double price;
        private Integer area;
        private Integer bedrooms;
        private Integer bathrooms;
        private List<String> amenities;
        private String description;
        private List<String> images;
        private String verificationStatus;
        private String availabilityStatus;
    }
}
