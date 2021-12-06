package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum RolesEnum {
    ROLE_LEADER_SPECIAL("ROLE_LEADER_SPECIAL", "Role lãnh đạo đơn vị đặc biệt"),
    ROLE_LEADER("ROLE_LEADER", "Role lãnh đạo"),
    ROLE_EMPLOYEE_SPECIAL("ROLE_EMPLOYEE_SPECIAL", "Role nhân viên đơn vị đặc biệt"),
    ROLE_EMPLOYEE("ROLE_EMPLOYEE", "Role nhân viên"),
    ROLE_ADMIN("ROLE_ADMIN", "Role quản trị hệ thống"),
    ;

    private final String role;
    private final String description;

    RolesEnum(String role, String description) {
        this.role = role;
        this.description = description;
    }
}
