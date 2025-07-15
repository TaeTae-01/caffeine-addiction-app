package com.example.caffein_addiction_app.auth.controller;

import com.example.caffein_addiction_app.auth.dto.request.LoginRequestDto;
import com.example.caffein_addiction_app.auth.dto.request.RegisterRequestDto;
import com.example.caffein_addiction_app.auth.dto.response.*;
import com.example.caffein_addiction_app.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/user-info")
    public ResponseEntity<? super UserInfoResponseDto> userInfo(HttpServletRequest request){
        ResponseEntity<? super UserInfoResponseDto> response = authService.userInfo(request);
        return response;
    }
}
