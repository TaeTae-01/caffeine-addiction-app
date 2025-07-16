package com.example.caffein_addiction_app.auth.controller;

import com.example.caffein_addiction_app.auth.dto.request.EditUserInfoRequestDto;
import com.example.caffein_addiction_app.auth.dto.request.LoginRequestDto;
import com.example.caffein_addiction_app.auth.dto.request.RegisterRequestDto;
import com.example.caffein_addiction_app.auth.dto.response.*;
import com.example.caffein_addiction_app.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<? super RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto dto){
        ResponseEntity<? super RegisterResponseDto> response = authService.register(dto);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<? super LoginResponseDto> login(@Valid @RequestBody LoginRequestDto dto){
        ResponseEntity<? super LoginResponseDto> response = authService.login(dto);
        return response;
    }

    @PostMapping("/refresh")
    public ResponseEntity<? super RefreshTokenResponseDto> refreshToken(HttpServletRequest request) {
        ResponseEntity<? super RefreshTokenResponseDto> response = authService.refreshToken(request);
        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<? super LogOutResponseDto> logout(HttpServletRequest request) {
        ResponseEntity<? super LogOutResponseDto> response = authService.logout(request);
        return response;
    }

    @GetMapping("/user/info")
    public ResponseEntity<? super GetUserInfoResponseDto> userInfo(@AuthenticationPrincipal Integer userId){
        ResponseEntity<? super GetUserInfoResponseDto> response = authService.getUserInfo(userId);
        return response;
    }

    @PatchMapping("/user/edit")
    public ResponseEntity<? super EditUserInfoResponseDto> userInfo(@AuthenticationPrincipal Integer userId , @Valid @RequestBody EditUserInfoRequestDto dto){
        ResponseEntity<? super EditUserInfoResponseDto> response = authService.editUserInfo(userId, dto);
        return response;
    }
}
