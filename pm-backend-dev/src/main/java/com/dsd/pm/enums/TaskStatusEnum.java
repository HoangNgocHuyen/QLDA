package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum TaskStatusEnum {

    OPEN("OPEN", "Chưa thực hiện"),
    CLOSED("CLOSED", "Hoàn thành"),
    ;

    private final String status;
    private final String desc;

    TaskStatusEnum(String status, String desc) {
        this.status = status;
        this.desc = desc;
    }
}
