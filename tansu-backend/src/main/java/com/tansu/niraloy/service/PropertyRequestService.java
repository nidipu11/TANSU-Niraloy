package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.PropertyRequestDto;
import com.tansu.niraloy.model.PropertyRequest;
import java.util.List;

public interface PropertyRequestService {
    PropertyRequest submitRequest(PropertyRequestDto requestDto);
    List<PropertyRequest> getRequestsByTenant(String tenantId);
    List<PropertyRequest> getRequestsByUser(String userIdentifier);
    List<PropertyRequest> getAllRequests();
    PropertyRequest updateStatus(String requestId, String status, String escortOfficer);
    PropertyRequest approveRequest(String idOrRequestId);
    PropertyRequest rejectRequest(String idOrRequestId);
}
