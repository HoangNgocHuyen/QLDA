package com.dsd.pm.web.rest.errors;

import com.dsd.pm.enums.MessageEnum;

public class ApiException extends RuntimeException {

    private final MessageEnum errorStatus;

    public ApiException(MessageEnum errorStatus, String msg) {
        super(msg);
        this.errorStatus = errorStatus;
    }

    public ApiException(MessageEnum errorStatus) {
        super(errorStatus.getMessage());
        this.errorStatus = errorStatus;
    }

    public MessageEnum getErrorStatus() {
        return errorStatus;
    }
}
