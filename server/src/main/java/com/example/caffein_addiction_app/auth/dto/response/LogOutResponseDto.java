package com.example.caffein_addiction_app.auth.dto.response;

import com.example.caffein_addiction_app.common.ResponseDto;
import com.example.caffein_addiction_app.common.ResponseMessage;
import com.example.caffein_addiction_app.common.ResponseStatus;
import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

@Getter
public class LogOutResponseDto extends ResponseDto {

    private LogOutResponseDto(){super(200,ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);}

    public static ResponseEntity<LogOutResponseDto> success(){
        LogOutResponseDto result = new LogOutResponseDto();

        //refresh토큰 쿠키에서 삭제
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, cookie.toString()).body(result);
    }

    public static ResponseEntity<ResponseDto> invalidToken(){
        ResponseDto result = new ResponseDto(403, ResponseStatus.INVALID_TOKEN, ResponseMessage.INVALID_TOKEN);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    }
}
