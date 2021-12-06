package com.dsd.pm.service.dto;

import com.dsd.pm.enums.NotifyStatusEnum;
import com.dsd.pm.enums.NotifyTypeEnum;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;


@Getter
@Setter
public class NotificationSearchDTO extends SearchBase {

    private String title;
    private NotifyTypeEnum type;
    private NotifyStatusEnum status;
    private Instant startTime;
    private Instant endTime;

}
