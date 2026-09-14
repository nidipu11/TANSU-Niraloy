package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.PropertyDto;
import com.tansu.niraloy.model.Property;
import com.tansu.niraloy.repository.PropertyRepository;
import com.tansu.niraloy.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;

    @Override
    public List<Property> searchProperties(String location, String propertyType, String purpose, Double maxPrice, Integer bedrooms) {
        return propertyRepository.searchProperties(location, propertyType, purpose, maxPrice, bedrooms);
    }

    @Override
    public Property getPropertyById(String propertyId) {
        return propertyRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new RuntimeException("Property with ID " + propertyId + " not found."));
    }

    @Override
    public Property createProperty(PropertyDto.CreatePropertyRequest req) {
        Property property = Property.builder()
                .ownerId(req.getOwnerId())
                .title(req.getTitle())
                .location(req.getLocation())
                .propertyType(req.getPropertyType())
                .purpose(req.getPurpose())
                .price(req.getPrice())
                .area(req.getArea())
                .bedrooms(req.getBedrooms())
                .bathrooms(req.getBathrooms())
                .amenities(req.getAmenities())
                .description(req.getDescription())
                .images(req.getImages())
                .status("PENDING")
                .verificationStatus("PENDING_VERIFICATION")
                .availabilityStatus("PENDING_VERIFICATION")
                .submissionDate(LocalDate.now())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .build();

        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(String propertyId, PropertyDto.UpdatePropertyRequest req) {
        Property existing = getPropertyById(propertyId);

        if (req.getTitle() != null) existing.setTitle(req.getTitle());
        if (req.getLocation() != null) existing.setLocation(req.getLocation());
        if (req.getPropertyType() != null) existing.setPropertyType(req.getPropertyType());
        if (req.getPurpose() != null) existing.setPurpose(req.getPurpose());
        if (req.getPrice() != null) existing.setPrice(req.getPrice());
        if (req.getArea() != null) existing.setArea(req.getArea());
        if (req.getBedrooms() != null) existing.setBedrooms(req.getBedrooms());
        if (req.getBathrooms() != null) existing.setBathrooms(req.getBathrooms());
        if (req.getAmenities() != null) existing.setAmenities(req.getAmenities());
        if (req.getDescription() != null) existing.setDescription(req.getDescription());
        if (req.getImages() != null) existing.setImages(req.getImages());
        if (req.getVerificationStatus() != null) {
            existing.setVerificationStatus(req.getVerificationStatus());
            if ("VERIFIED".equalsIgnoreCase(req.getVerificationStatus())) {
                existing.setStatus("APPROVED");
            } else if ("REJECTED".equalsIgnoreCase(req.getVerificationStatus())) {
                existing.setStatus("REJECTED");
            } else {
                existing.setStatus("PENDING");
            }
        }
        if (req.getAvailabilityStatus() != null) existing.setAvailabilityStatus(req.getAvailabilityStatus());

        return propertyRepository.save(existing);
    }

    @Override
    public void deleteProperty(String propertyId) {
        Property existing = getPropertyById(propertyId);
        propertyRepository.delete(existing);
    }

    @Override
    public List<Property> getPropertiesByOwner(String ownerId) {
        return propertyRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    @Override
    public List<Property> getPendingProperties() {
        List<Property> list = propertyRepository.findByStatusOrderByCreatedAtDesc("PENDING");
        if (list.isEmpty()) {
            list = propertyRepository.findByVerificationStatus("PENDING_VERIFICATION");
        }
        return list;
    }

    @Override
    public Property approveProperty(String propertyId) {
        Property property = getPropertyById(propertyId);
        property.setStatus("APPROVED");
        property.setVerificationStatus("VERIFIED");
        property.setAvailabilityStatus("SALE".equalsIgnoreCase(property.getPurpose()) ? "AVAILABLE_FOR_SALE" : "AVAILABLE_FOR_RENT");
        return propertyRepository.save(property);
    }

    @Override
    public Property rejectProperty(String propertyId) {
        Property property = getPropertyById(propertyId);
        property.setStatus("REJECTED");
        property.setVerificationStatus("REJECTED");
        property.setAvailabilityStatus("REJECTED");
        return propertyRepository.save(property);
    }
}
