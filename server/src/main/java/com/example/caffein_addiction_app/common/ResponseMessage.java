package com.example.caffein_addiction_app.common;

public interface ResponseMessage {

    //200
    String SUCCESS = "OK";

    //400
    String VALIDATION_FAILED = "Validation Failed.";
    String DUPLICATE_EMAIL = "Duplication Email.";
    String NOT_EXISTED_USER = "This user does not exist";

    //401
    String SIGN_IN_FAIL = "Login information mismatch";
    String AUTHORIZATION_FAIL = "Authorization Failed";
    String INVALID_REFRESH_TOKEN = "Invalid refresh token.";
    String EXPIRED_REFRESH_TOKEN = "Expired refresh token.";

    //403
    String NO_PERMISSION = "Do not have permission";

    //500
    String DATABASE_ERROR = "Internal Server Error";
}
