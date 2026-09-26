package com.tansu.niraloy.controller;

import com.tansu.niraloy.dto.ApiResponse;
import com.tansu.niraloy.dto.AuthDto;
import com.tansu.niraloy.exception.EmailAlreadyExistsException;
import com.tansu.niraloy.exception.InvalidCredentialsException;
import com.tansu.niraloy.exception.UserNotFoundException;
import com.tansu.niraloy.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthDto.UserResponse>> signIn(@Valid @RequestBody AuthDto.SignInRequest request) {
        try {
            AuthDto.UserResponse user = authService.signIn(request);
            return ResponseEntity.ok(ApiResponse.ok("Sign in successful.", user));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthDto.UserResponse>> signUp(@Valid @RequestBody AuthDto.SignUpRequest request) {
        return handleRegistration(request);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.UserResponse>> register(@Valid @RequestBody AuthDto.SignUpRequest request) {
        return handleRegistration(request);
    }

    private ResponseEntity<ApiResponse<AuthDto.UserResponse>> handleRegistration(AuthDto.SignUpRequest request) {
        try {
            AuthDto.UserResponse user = authService.signUp(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Account registered successfully.", user));
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
