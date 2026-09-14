package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.PropertyDto;
import com.tansu.niraloy.model.Property;
import java.util.List;

public interface PropertyService {
    List<Property> searchProperties(String location, String propertyType, String purpose, Double maxPrice, Integer bedrooms);
    Property getPropertyById(String propertyId);
    Property createProperty(PropertyDto.CreatePropertyRequest request);
    Property updateProperty(String propertyId, PropertyDto.UpdatePropertyRequest request);
    void deleteProperty(String propertyId);
    List<Property> getPropertiesByOwner(String ownerId);
    List<Property> getPendingProperties();
    Property approveProperty(String propertyId);
    Property rejectProperty(String propertyId);
}
