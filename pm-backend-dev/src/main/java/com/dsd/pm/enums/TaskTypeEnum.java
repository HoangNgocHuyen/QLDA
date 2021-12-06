package com.dsd.pm.enums;

import lombok.Getter;

/**
 * Created by sonba@itsol.vn
 * Date: 27/05/2021
 * Time: 9:14 PM
 */
@Getter
public enum TaskTypeEnum {

    WORK("WORK", "Công việc"),
    MEETING_SCHEDULE("MEETING_SCHEDULE", "Lịch họp"),
    ;

    private final String type;
    private final String desc;

    TaskTypeEnum(String type, String desc) {
        this.type = type;
        this.desc = desc;
    }
}
