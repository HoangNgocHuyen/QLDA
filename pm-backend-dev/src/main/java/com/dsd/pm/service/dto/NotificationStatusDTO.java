package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class NotificationStatusDTO {

    @NotNull
    private List<Long> notificationIds;
    @NotBlank
    private String username;

}
