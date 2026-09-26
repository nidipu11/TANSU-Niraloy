package com.tansu.niraloy.service.impl;

import com.tansu.niraloy.dto.AuthDto;
import com.tansu.niraloy.exception.EmailAlreadyExistsException;
import com.tansu.niraloy.exception.InvalidCredentialsException;
import com.tansu.niraloy.exception.UserNotFoundException;
import com.tansu.niraloy.model.Role;
import com.tansu.niraloy.model.User;
import com.tansu.niraloy.model.UserLoginLog;
import com.tansu.niraloy.repository.UserLoginLogRepository;
import com.tansu.niraloy.repository.UserRepository;
import com.tansu.niraloy.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserLoginLogRepository loginLogRepository;

    @Override
    @Transactional
    public AuthDto.UserResponse signIn(AuthDto.SignInRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        // Special Pre-provisioned Admin Account for System Evaluation
        if ("admin@tansu.gov.bd".equalsIgnoreCase(cleanEmail) && "Admin123".equals(password)) {
            User admin = userRepository.findByEmail("admin@tansu.gov.bd").orElseGet(() -> {
                User newAdmin = User.builder()
                        .userId("ADM-001")
                        .name("TANSU System Administrator")
                        .email("admin@tansu.gov.bd")
                        .password("Admin123")
                        .phone("01700000000")
                        .role(Role.ADMIN)
                        .build();
                return userRepository.save(newAdmin);
            });

            recordLoginLog(cleanEmail, "ADMIN", "SUCCESS");
            return mapToResponse(admin);
        }

        // 1. Strict Check: Account existence
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);
        if (userOpt.isEmpty()) {
            recordLoginLog(cleanEmail, "UNKNOWN", "FAILED - NO ACCOUNT");
            throw new UserNotFoundException("No account found with this email. Please sign up first.");
        }

        User user = userOpt.get();

        // 2. Strict Check: Password validation
        if (!user.getPassword().equals(password)) {
            String roleName = user.getRole() != null ? user.getRole().name() : "USER";
            recordLoginLog(cleanEmail, roleName, "FAILED - INVALID PASSWORD");
            throw new InvalidCredentialsException("Invalid credentials.");
        }

        // 3. Login Succeeded
        String roleName = user.getRole() != null ? user.getRole().name() : "USER";
        recordLoginLog(cleanEmail, roleName, "SUCCESS");
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AuthDto.UserResponse signUp(AuthDto.SignUpRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new EmailAlreadyExistsException("Email already registered.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.TENANT;
        // Never allow self-registering as ADMIN
        if (role == Role.ADMIN) {
            role = Role.TENANT;
        }

        String prefix = (role == Role.OWNER) ? "OWN" : "TNT";
        String generatedUserId = prefix + "-" + (1000 + (System.currentTimeMillis() % 90000));
        while (userRepository.findByUserId(generatedUserId).isPresent()) {
            generatedUserId = prefix + "-" + (1000 + (long) (Math.random() * 90000));
        }

        User user = User.builder()
                .userId(generatedUserId)
                .name(request.getFullName().trim())
                .email(cleanEmail)
                .password(request.getPassword())
                .phone(request.getPhone().trim())
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);

        // Record successful initial registration login
        recordLoginLog(cleanEmail, role.name(), "SUCCESS");

        return mapToResponse(saved);
    }

    private void recordLoginLog(String email, String role, String status) {
        try {
            UserLoginLog log = UserLoginLog.builder()
                    .email(email)
                    .role(role)
                    .loginTime(LocalDateTime.now())
                    .status(status)
                    .build();
            loginLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Could not record login log: " + e.getMessage());
        }
    }

    private AuthDto.UserResponse mapToResponse(User user) {
        AuthDto.UserResponse resp = new AuthDto.UserResponse();
        resp.setUserId(user.getUserId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole());
        resp.setToken("tansu-jwt-" + UUID.randomUUID());
        return resp;
    }
}
