package com.example.caffein_addiction_app.auth.dto.response;

import com.example.caffein_addiction_app.common.ResponseDto;
import com.example.caffein_addiction_app.common.ResponseMessage;
import com.example.caffein_addiction_app.common.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class EditUserInfoResponseDto extends ResponseDto {

    private EditUserInfoResponseDto(){super(200, ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);}

    public static ResponseEntity<EditUserInfoResponseDto> success(){
        EditUserInfoResponseDto result = new EditUserInfoResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> duplicateEmail(){
        ResponseDto result = new ResponseDto(409,ResponseStatus.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistedUser(){
        ResponseDto result = new ResponseDto(404, ResponseStatus.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
}
