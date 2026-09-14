package com.tansu.niraloy.dto;

import com.tansu.niraloy.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class SignInRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class SignUpRequest {
        @NotBlank(message = "Full legal name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Phone number is required")
        private String phone;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotNull(message = "Role is required (TENANT or OWNER)")
        private Role role;
    }

    @Data
    public static class UserResponse {
        private String userId;
        private String name;
        private String email;
        private String phone;
        private Role role;
        private String token;
    }
}
