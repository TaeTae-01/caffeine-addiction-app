package com.example.caffein_addiction_app.auth.service;

import com.example.caffein_addiction_app.auth.dto.request.LoginRequestDto;
import com.example.caffein_addiction_app.auth.dto.request.RegisterRequestDto;
import com.example.caffein_addiction_app.auth.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super RegisterResponseDto> register(RegisterRequestDto dto);
    ResponseEntity<? super LoginResponseDto> login(LoginRequestDto dto);
    ResponseEntity<? super RefreshTokenResponseDto> refreshToken(HttpServletRequest request);
    ResponseEntity<? super LogOutResponseDto> logout(HttpServletRequest request);
    ResponseEntity<? super UserInfoResponseDto> userInfo(HttpServletRequest request);
}
