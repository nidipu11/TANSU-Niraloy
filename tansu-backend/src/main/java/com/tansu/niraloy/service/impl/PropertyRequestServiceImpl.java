package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.PropertyRequestDto;
import com.tansu.niraloy.model.Property;
import com.tansu.niraloy.model.PropertyRequest;
import com.tansu.niraloy.model.TenantDue;
import com.tansu.niraloy.model.User;
import com.tansu.niraloy.repository.PropertyRepository;
import com.tansu.niraloy.repository.PropertyRequestRepository;
import com.tansu.niraloy.repository.TenantDueRepository;
import com.tansu.niraloy.repository.UserRepository;
import com.tansu.niraloy.service.PropertyRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyRequestServiceImpl implements PropertyRequestService {

    private final PropertyRequestRepository requestRepository;
    private final PropertyRepository propertyRepository;
    private final TenantDueRepository dueRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public PropertyRequest submitRequest(PropertyRequestDto dto) {
        String notes = dto.getNotes() != null && !dto.getNotes().trim().isEmpty()
                ? dto.getNotes().trim()
                : (dto.getMessage() != null ? dto.getMessage().trim() : null);

        String tenantName = dto.getTenantName();
        String tenantEmail = dto.getTenantEmail();

        // If email or name is missing, attempt to enrich from UserRepository
        if ((tenantName == null || tenantName.trim().isEmpty() || tenantEmail == null || tenantEmail.trim().isEmpty())
                && dto.getTenantId() != null) {
            Optional<User> userOpt = userRepository.findByUserId(dto.getTenantId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (tenantName == null || tenantName.trim().isEmpty()) {
                    tenantName = user.getName();
                }
                if (tenantEmail == null || tenantEmail.trim().isEmpty()) {
                    tenantEmail = user.getEmail();
                }
            }
        }

        if (tenantName == null || tenantName.trim().isEmpty()) {
            tenantName = tenantEmail != null && !tenantEmail.trim().isEmpty() ? tenantEmail : dto.getTenantId();
        }

        PropertyRequest req = PropertyRequest.builder()
                .propertyId(dto.getPropertyId())
                .tenantId(dto.getTenantId())
                .tenantName(tenantName)
                .tenantPhone(dto.getTenantPhone())
                .tenantEmail(tenantEmail)
                .requestType(dto.getRequestType())
                .preferredDate(dto.getPreferredDate())
                .notes(notes)
                .status("PENDING")
                .build();

        return requestRepository.save(req);
    }

    @Override
    public List<PropertyRequest> getRequestsByTenant(String tenantId) {
        return requestRepository.findByTenantId(tenantId);
    }

    @Override
    public List<PropertyRequest> getRequestsByUser(String userIdentifier) {
        if (userIdentifier == null || userIdentifier.trim().isEmpty()) {
            return List.of();
        }
        String cleanId = userIdentifier.trim();

        // Check if userIdentifier matches user by ID or Email to get both IDs
        String resolvedTenantId = cleanId;
        String resolvedEmail = cleanId;

        if (cleanId.contains("@")) {
            userRepository.findByEmail(cleanId.toLowerCase()).ifPresent(u -> {
                // resolvedTenantId = u.getUserId();
            });
            return requestRepository.findByTenantIdOrTenantEmail(cleanId, cleanId);
        } else {
            Optional<User> uOpt = userRepository.findByUserId(cleanId);
            if (uOpt.isPresent()) {
                resolvedEmail = uOpt.get().getEmail();
            }
            return requestRepository.findByTenantIdOrTenantEmail(resolvedTenantId, resolvedEmail);
        }
    }

    @Override
    public List<PropertyRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @Override
    @Transactional
    public PropertyRequest updateStatus(String requestId, String status, String escortOfficer) {
        PropertyRequest req = findRequestByIdOrRequestId(requestId);

        if (status != null) req.setStatus(status);
        if (escortOfficer != null) req.setEscortOfficer(escortOfficer);

        return requestRepository.save(req);
    }

    @Override
    @Transactional
    public PropertyRequest approveRequest(String idOrRequestId) {
        PropertyRequest req = findRequestByIdOrRequestId(idOrRequestId);
        req.setStatus("APPROVED");
        PropertyRequest savedReq = requestRepository.save(req);

        // If request is for Rent, automatically generate record in tenant_dues and update property status
        String reqType = req.getRequestType() != null ? req.getRequestType().toUpperCase() : "";
        if (reqType.contains("RENT") || reqType.equals("RENT_REQUEST") || reqType.equals("RENT")) {
            Property property = propertyRepository.findByPropertyId(req.getPropertyId()).orElse(null);

            Double rentAmount = (property != null && property.getPrice() != null) ? property.getPrice() : 45000.0;
            Double utilityCharge = 5000.0;
            Double totalBilled = rentAmount + utilityCharge;

            LocalDate today = LocalDate.now();
            String dueMonth = today.getMonth().name() + " " + today.getYear();
            String dueDate = today.withDayOfMonth(Math.min(25, today.lengthOfMonth())).toString();

            String flatTitle = (property != null && property.getTitle() != null) ? property.getTitle() : "Rental Property " + req.getPropertyId();
            String location = (property != null && property.getLocation() != null) ? property.getLocation() : "Dhaka";

            TenantDue due = TenantDue.builder()
                    .dueId("DUE-" + (1000 + (System.currentTimeMillis() % 90000)))
                    .tenantId(req.getTenantId())
                    .tenantName(req.getTenantName())
                    .tenantPhone(req.getTenantPhone())
                    .tenantEmail(req.getTenantEmail())
                    .propertyId(req.getPropertyId())
                    .flatTitle(flatTitle)
                    .location(location)
                    .dueMonth(dueMonth)
                    .rentAmount(rentAmount)
                    .utilityCharge(utilityCharge)
                    .totalBilled(totalBilled)
                    .paidAmount(0.0)
                    .dueAmount(totalBilled)
                    .dueDate(dueDate)
                    .daysOverdue(0)
                    .status("UNPAID")
                    .noticeSent(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            dueRepository.save(due);

            // Update property status to RENTED
            if (property != null) {
                property.setAvailabilityStatus("RENTED");
                propertyRepository.save(property);
            }
        }

        return savedReq;
    }

    @Override
    @Transactional
    public PropertyRequest rejectRequest(String idOrRequestId) {
        PropertyRequest req = findRequestByIdOrRequestId(idOrRequestId);
        req.setStatus("REJECTED");
        return requestRepository.save(req);
    }

    private PropertyRequest findRequestByIdOrRequestId(String idOrRequestId) {
        if (idOrRequestId == null || idOrRequestId.trim().isEmpty()) {
            throw new RuntimeException("Request ID is required.");
        }
        String clean = idOrRequestId.trim();
        Optional<PropertyRequest> opt = requestRepository.findByRequestId(clean);
        if (opt.isPresent()) return opt.get();

        try {
            Long numericId = Long.parseLong(clean);
            return requestRepository.findById(numericId)
                    .orElseThrow(() -> new RuntimeException("Property request not found for ID: " + clean));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Property request not found for ID: " + clean);
        }
    }
}
