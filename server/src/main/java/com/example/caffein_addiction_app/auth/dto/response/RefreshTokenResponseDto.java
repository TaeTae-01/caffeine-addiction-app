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
public class RefreshTokenResponseDto extends ResponseDto {

    private String newToken;

    private RefreshTokenResponseDto(String newToken){
        super(200,ResponseStatus.SUCCESS, ResponseMessage.SUCCESS);
        this.newToken = newToken;
    }

    public static ResponseEntity<RefreshTokenResponseDto> success(String newAccessToken, String newRefreshToken){
        RefreshTokenResponseDto result = new RefreshTokenResponseDto(newAccessToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken",newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh") //refresh할때만 쿠키전송
                .maxAge(Duration.ofDays(30)) //refresh token = 30일
                .sameSite("Strict")
                .build();

        return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, cookie.toString()).body(result);
    }

    public static ResponseEntity<ResponseDto> invalidRefreshToken(){
        ResponseDto result = new ResponseDto(403,ResponseStatus.INVALID_REFRESH_TOKEN, ResponseMessage.INVALID_REFRESH_TOKEN);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    }

    public static ResponseEntity<ResponseDto> expiredRefreshToken(){
        ResponseDto result = new ResponseDto(401, ResponseStatus.EXPIRED_REFRESH_TOKEN, ResponseMessage.EXPIRED_REFRESH_TOKEN);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
