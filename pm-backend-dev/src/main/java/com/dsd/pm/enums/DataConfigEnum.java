package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum DataConfigEnum {
    USER_ADMIN("admin", "Administrator"),
    UNIT_S101("S101", "Đơn vị đặc biệt"),
    ;

    private final String code;
    private final String name;

    DataConfigEnum(String code, String name) {
        this.code = code;
        this.name = name;
    }
}
