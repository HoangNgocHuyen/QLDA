package com.dsd.pm.enums;

import lombok.Getter;

@Getter
public enum MessageEnum {

    OK("00", "Success"),
    UNHANDLED_ERROR("001", "Unhandled error", "%s"),
    REQUEST_INVALID("002", "Request invalid", "%s"),
    TARGET_NOT_FOUND("003", "Target not found", "%s"),
    USERS_NOT_FOUND("004", "User not found", "%s"),
    TASK_NOT_FOUND("005", "Task not found", "%s"),
    SCHEDULE_NOT_FOUND("006", "Schedule not found", "%s"),
    ARGUMENT_NOT_VALID("007", "Argument not valid", "%s"),
    ALREADY_EXITS("008", "Already exist", "%s"),
    NOT_FOUND("010", "Not found", "Object %s not found"),
    CODE_EXIST("011", "Code exist", "%s"),
    PROJECT_NOT_FOUND("012", "Project not found", "%s"),
    TARGET_GROUP_NOT_FOUND("013", "Group not found", "%s"),
    UNIT_NOT_FOUND("014", "Unit not found", "%s"),
    STATUS_INVALID("015", "Status invalid", "%s"),
    FILE_INVALID("016", "File invalid", "%s"),
    IMPORT_FILE_ERROR("017", "Import File error", "%s"),
    NOT_PERMISSION("018", "Not permission", "%s"),
    ;

    private final String code;
    private String message;
    private String messageFormat;

    MessageEnum(String code, String message) {
        this.code = code;
        this.message = message;
    }

    MessageEnum(String code, String message, String messageFormat) {
        this.code = code;
        this.message = message;
        this.messageFormat = messageFormat;
    }

    public MessageEnum format(Object... str) {
        if (this.messageFormat != null) {
            this.message = String.format(this.messageFormat, str);
        }
        return this;
    }

}
