package com.dsd.pm.service.dto;

import com.dsd.pm.enums.TargetStatusEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TargetSearchDTO extends SearchBase {

    private String title;
    private String code;
    private String projectCode;
    private String groupCode;
    private Instant startTime;
    private Instant endTime;
    private TargetStatusEnum status;

}
