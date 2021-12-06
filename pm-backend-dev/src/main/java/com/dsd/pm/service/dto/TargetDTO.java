package com.dsd.pm.service.dto;
import java.time.Instant;
import java.io.Serializable;

import com.dsd.pm.enums.TargetStatusEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TargetDTO extends CsvDTO implements Serializable {

    private Long id;
    private Long projectId;
    private String projectName;
    private String projectCode;
    private String groupName;
    private String groupCode;
    private Long groupId;
    private String code;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private Integer numberDay;
    private Integer numberDayWorking;
    private Integer numberMeeting;
    private String unitCode;
    private String unitName;
    private TargetStatusEnum status;
    private Integer donePercent;
    private Instant createdAt;
    private String createdBy;
    private Instant closedAt;
    private String closedBy;

}
