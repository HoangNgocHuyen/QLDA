package com.dsd.pm.service.dto;

import com.dsd.pm.enums.NotifyTypeEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendNotifyDTO {
    private Long id;
    private String title;
    private String message;
    private NotifyTypeEnum type;
    private long countSent;
}
