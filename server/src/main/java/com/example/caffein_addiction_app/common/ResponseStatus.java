package com.example.caffein_addiction_app.common;

public interface ResponseStatus {

    //200
    String SUCCESS = "SU";

    //400
    String VALIDATION_FAILED = "VF";
    String DUPLICATE_EMAIL = "DE";
    String NOT_EXISTED_USER = "NU";

    //401
    String LOG_IN_FAIL = "LF";
    String MISMATCH_FAIL = "MF";
    String AUTHORIZATION_FAIL = "AF";
    String INVALID_TOKEN = "IT";
    String INVALID_REFRESH_TOKEN = "IRT";
    String EXPIRED_REFRESH_TOKEN = "ERT";

    //403
    String NO_PERMISSION = "NP";

    //500
    String DATABASE_ERROR = "DBE";
}
