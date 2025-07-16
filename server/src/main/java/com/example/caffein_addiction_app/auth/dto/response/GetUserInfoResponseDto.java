package com.example.caffein_addiction_app.auth.dto.response;

import com.example.caffein_addiction_app.auth.entity.User;
import com.example.caffein_addiction_app.common.ResponseDto;
import com.example.caffein_addiction_app.common.ResponseMessage;
import com.example.caffein_addiction_app.common.ResponseStatus;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class GetUserInfoResponseDto extends ResponseDto {

    private User user;

    private GetUserInfoResponseDto(User user) {
        super(200, ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);
        this.user = user;
    }

    public static ResponseEntity<GetUserInfoResponseDto> success(User user) {
        GetUserInfoResponseDto result = new GetUserInfoResponseDto(user);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistedUser(){
        ResponseDto result = new ResponseDto(404, ResponseStatus.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
}
