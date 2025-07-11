package com.example.caffein_addiction_app.auth.dto.response;

import com.example.caffein_addiction_app.common.ResponseDto;
import com.example.caffein_addiction_app.common.ResponseMessage;
import com.example.caffein_addiction_app.common.ResponseStatus;
import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import java.time.Duration;

@Getter
public class LoginResponseDto extends ResponseDto {

    private String token;

    private LoginResponseDto(String token){
        super(200, ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);
        this.token = token;
    }

    public static ResponseEntity<LoginResponseDto> success(String accessToken, String refreshToken){
        LoginResponseDto result = new LoginResponseDto(accessToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken",refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh") //refresh할때만 쿠키전송
                .maxAge(Duration.ofDays(30)) //refresh token = 30일
                .sameSite("Strict")
                .build();

        return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, cookie.toString()).body(result);
    }

    public static ResponseEntity<ResponseDto> loginFail(){
        ResponseDto result = new ResponseDto(401, ResponseStatus.LOG_IN_FAIL, ResponseMessage.LOG_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

}
