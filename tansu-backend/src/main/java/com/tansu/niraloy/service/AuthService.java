package com.tansu.niraloy.service;

import com.tansu.niraloy.dto.AuthDto;

public interface AuthService {
    AuthDto.UserResponse signIn(AuthDto.SignInRequest request);
    AuthDto.UserResponse signUp(AuthDto.SignUpRequest request);
}
