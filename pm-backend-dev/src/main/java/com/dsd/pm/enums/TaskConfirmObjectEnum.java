package com.dsd.pm.enums;

import com.dsd.pm.service.dto.TaskConfirmDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sonba@itsol.vn
 * Date: 27/05/2021
 * Time: 10:55 PM
 */
@Getter
public enum TaskConfirmObjectEnum {

    S101("S101", "S101"),
    CONTRACTORS("CONTRACTORS", "Nhà thầu"),
    OWNER("OWNER", "Chủ sử dụng"),
    ;

    private final String objectConfirm;
    private final String desc;

    TaskConfirmObjectEnum(String objectConfirm, String desc) {
        this.objectConfirm = objectConfirm;
        this.desc = desc;
    }

    public static List<TaskConfirmDTO> getListObjectConfirm(Long taskId) {
        List<TaskConfirmDTO> dtos = new ArrayList<>();
        for (TaskConfirmObjectEnum value : TaskConfirmObjectEnum.values()) {
            dtos.add(new TaskConfirmDTO(taskId, value));
        }
        return dtos;
    }
}
