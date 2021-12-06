package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum PositionEnum {
    LEADER("LEADER", "Lãnh Đạo"),
    EMPLOYEE("EMPLOYEE", "Nhân Viên"),
    ADMIN("ADMIN", "Quản Trị Hệ Thống"),
    ;

    private final String position;
    private final String description;

    PositionEnum(String position, String description) {
        this.position = position;
        this.description = description;
    }
}
