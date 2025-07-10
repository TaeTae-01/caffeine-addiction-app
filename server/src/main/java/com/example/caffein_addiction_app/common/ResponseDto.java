package com.example.caffein_addiction_app.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@AllArgsConstructor
public class ResponseDto {

    private Integer code;
    private String status;
    private String message;

    public static ResponseEntity<ResponseDto> databaseError(){
        ResponseDto result = new ResponseDto(500, ResponseStatus.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
