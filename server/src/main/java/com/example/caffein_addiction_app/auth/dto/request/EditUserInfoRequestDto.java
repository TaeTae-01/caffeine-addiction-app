package com.example.caffein_addiction_app.auth.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditUserInfoRequestDto {

    private String email;
    private String name;
    private Float weight;
    private Integer dailyCaffeineLimit;
}
