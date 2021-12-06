package com.dsd.pm.enums;

import lombok.Getter;

/**
 * Created by sonba@itsol.vn
 * Date: 25/05/2021
 * Time: 8:42 PM
 */
@Getter
public enum UnitStatusEnum {

    ACTIVE("ACTIVE", "Hoạt động"),
    INACTIVE("INACTIVE", "Không hoạt động"),
    DELETE("DELETE", "Xóa"),
    ;

    private final String status;
    private final String description;

    UnitStatusEnum(String status, String description) {
        this.status = status;
        this.description = description;
    }
}
