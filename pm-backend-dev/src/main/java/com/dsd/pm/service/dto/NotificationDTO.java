package com.dsd.pm.service.dto;

import com.dsd.pm.domain.Notification;
import com.dsd.pm.enums.NotifyStatusEnum;
import com.dsd.pm.enums.NotifyTypeEnum;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.time.Instant;
import java.util.List;


@Getter
@Setter
public class NotificationDTO {

    private Long id;
    private String title;
    private String username;
    private String projectCode;
    private String unitCode;
    private String taskCode;
    private String listUsername;
    private String message;
    private NotifyTypeEnum type;
    private NotifyStatusEnum status;
    private Instant createdDate;
    List<UserDTO> users;

    public NotificationDTO() {
    }

    public NotificationDTO(Long id, String title, String username, String projectCode, String unitCode, String taskCode, String listUsername, String message, NotifyTypeEnum type, NotifyStatusEnum status, Instant createdDate) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.projectCode = projectCode;
        this.unitCode = unitCode;
        this.taskCode = taskCode;
        this.listUsername = listUsername;
        this.message = message;
        this.type = type;
        this.status = status;
        this.createdDate = createdDate;
    }

    public NotificationDTO(Notification notc) {
        BeanUtils.copyProperties(notc, this);
    }

    public NotificationDTO(Notification notc, NotifyStatusEnum status) {
        BeanUtils.copyProperties(notc, this);
        this.status = status;
    }
}
