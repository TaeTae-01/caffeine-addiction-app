package com.example.caffein_addiction_app.auth.dto.response;

import com.example.caffein_addiction_app.common.ResponseDto;
import com.example.caffein_addiction_app.common.ResponseMessage;
import com.example.caffein_addiction_app.common.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class RegisterResponseDto extends ResponseDto {
    private RegisterResponseDto(){super(200,ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);}

    public static ResponseEntity<RegisterResponseDto> success(){
        RegisterResponseDto result = new RegisterResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    public static ResponseEntity<ResponseDto> duplicateEmail(){
        ResponseDto result = new ResponseDto(409,ResponseStatus.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
    }
}
