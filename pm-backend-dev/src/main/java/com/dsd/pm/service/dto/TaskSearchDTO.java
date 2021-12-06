package com.dsd.pm.service.dto;

import com.dsd.pm.enums.TaskTypeEnum;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class TaskSearchDTO extends SearchBase {

    private String projectCode;
    private String targetCode;
    private String code;
    private String name;
    private String parentCode;
    private TaskTypeEnum type;
    private Instant startDate;
    private Instant endDate;
    private boolean detail;

}
