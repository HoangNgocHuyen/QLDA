package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@SqlResultSetMapping(
        name = "TaskSearchResDTO",
        entities = @EntityResult(
                entityClass = TaskSearchResDTO.class,
                fields = {
                        @FieldResult(name = "userName", column = "user_name"),
                        @FieldResult(name = "fullName", column = "full_name"),
                        @FieldResult(name = "position", column = "uposition"),
                        @FieldResult(name = "unit", column = "unit"),
                        @FieldResult(name = "id", column = "task_id"),
                        @FieldResult(name = "code", column = "task_code"),
                        @FieldResult(name = "name", column = "task_name"),
                        @FieldResult(name = "type", column = "task_type"),
                        @FieldResult(name = "projectCode", column = "project_code"),
                        @FieldResult(name = "targetCode", column = "target_code"),
                        @FieldResult(name = "taskParentCode", column = "task_parent_code"),
                        @FieldResult(name = "status", column = "status"),
                        @FieldResult(name = "totalRecord", column = "total_record")
                }))
@Getter
@Setter
@Entity
public class TaskSearchResDTO {

    @Id
    private Long id;
    private String userName;
    private String fullName;
    private String position;
    private String unit;
    private String code;
    private String name;
    private String type;
    private String projectCode;
    private String targetCode;
    private String taskParentCode;
    private String status;
    private Long totalRecord;

}
