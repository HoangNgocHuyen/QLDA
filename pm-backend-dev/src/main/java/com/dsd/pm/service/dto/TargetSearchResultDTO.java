package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.time.Instant;

@Getter
@Setter
@SqlResultSetMapping(
        name = "TargetSearchResultDTO",
        entities = @EntityResult(
                entityClass = TargetSearchResultDTO.class,
                fields = {
                        @FieldResult(name = "id", column = "id"),
                        @FieldResult(name = "projectId", column = "project_id"),
                        @FieldResult(name = "projectName", column = "project_name"),
                        @FieldResult(name = "projectCode", column = "project_code"),
                        @FieldResult(name = "groupId", column = "group_id"),
                        @FieldResult(name = "groupName", column = "group_name"),
                        @FieldResult(name = "groupCode", column = "group_code"),
                        @FieldResult(name = "code", column = "code"),
                        @FieldResult(name = "title", column = "title"),
                        @FieldResult(name = "description", column = "description"),
                        @FieldResult(name = "startTime", column = "start_time"),
                        @FieldResult(name = "endTime", column = "end_time"),
                        @FieldResult(name = "numberDay", column = "number_day"),
                        @FieldResult(name = "numberDayWorking", column = "number_day_working"),
                        @FieldResult(name = "numberMeeting", column = "number_meeting"),
                        @FieldResult(name = "unitCode", column = "unit_code"),
                        @FieldResult(name = "unitName", column = "unit_name"),
                        @FieldResult(name = "status", column = "status"),
                        @FieldResult(name = "donePercent", column = "done_percent"),
                        @FieldResult(name = "createdAt", column = "created_at"),
                        @FieldResult(name = "createdBy", column = "created_by"),
                        @FieldResult(name = "closedAt", column = "closed_at"),
                        @FieldResult(name = "closedBy", column = "closed_by"),
                        @FieldResult(name = "totalRecord", column = "total_record")
                }))
@Entity
public class TargetSearchResultDTO {
    @Id
    private Long id;
    private Long projectId;
    private String projectName;
    private String projectCode;
    private Long groupId;
    private String groupName;
    private String groupCode;
    private String unitCode;
    private String unitName;
    private String code;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private Integer numberDay;
    private Integer numberDayWorking;
    private Integer numberMeeting;
    private String status;
    private Integer donePercent;
    private Instant createdAt;
    private String createdBy;
    private Instant closedAt;
    private String closedBy;
    private Long totalRecord;
}
