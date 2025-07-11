package com.example.caffein_addiction_app.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {

    @NotBlank(message = "이메일 입력은 필수 입력 항목입니다.")
    private String email;

    @NotBlank(message = "비밀번호 입력은 필수 입력 항목입니다.")
    private String password;
}
