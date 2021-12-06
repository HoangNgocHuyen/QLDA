package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum TaskConfirmStatusEnum {

    APPROVE("APPROVE", "Chấp nhận"),
    REJECT("REJECT", "Từ chối"),
    WAITING_APPROVE("WAITING_APPROVE", "Chờ duyệt"),
    RECEIVED("RECEIVED", "Đã nhận"),
    ;

    private final String confirmStatus;
    private final String desc;

    TaskConfirmStatusEnum(String confirmStatus, String desc) {
        this.confirmStatus = confirmStatus;
        this.desc = desc;
    }
}
