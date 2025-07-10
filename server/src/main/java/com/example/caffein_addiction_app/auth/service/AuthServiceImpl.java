package com.example.caffein_addiction_app.auth.service;

import com.example.caffein_addiction_app.auth.dto.request.RegisterRequestDto;
import com.example.caffein_addiction_app.auth.dto.response.RegisterResponseDto;
import com.example.caffein_addiction_app.auth.entity.User;
import com.example.caffein_addiction_app.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super RegisterResponseDto> register(RegisterRequestDto dto){

        try{
            boolean existedEmail = userRepository.existsByEmail(dto.getEmail());
            if(existedEmail) return RegisterResponseDto.duplicateEmail();

            String encodedPassword = passwordEncoder.encode(dto.getPassword());

            User user = new User(dto, encodedPassword);
            userRepository.save(user);
        } catch (Exception e){
            e.printStackTrace();
            return RegisterResponseDto.databaseError();
        }

        return RegisterResponseDto.success();
    }
}
