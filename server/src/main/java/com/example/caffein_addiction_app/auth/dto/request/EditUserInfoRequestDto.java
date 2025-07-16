package com.example.caffein_addiction_app.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditUserInfoRequestDto {

    @NotBlank(message = "이메일 입력은 필수 입력 항목입니다.")
    private String email;

    @NotBlank(message = "이름 입력은 필수 입력 항목입니다.")
    private String name;

    @NotNull(message = "몸무게는 필수 입력 항목입니다.")
    private Float weight;

    private Integer dailyCaffeineLimit;
}
