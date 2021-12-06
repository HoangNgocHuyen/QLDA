package com.dsd.pm.service.dto;

import com.dsd.pm.domain.TaskConfirm;
import com.dsd.pm.enums.TaskConfirmObjectEnum;
import com.dsd.pm.enums.TaskConfirmStatusEnum;
import com.dsd.pm.service.util.JSONFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * Created by sonba@itsol.vn
 * Date: 27/05/2021
 * Time: 10:45 PM
 */
@Getter
@Setter
public class TaskConfirmDTO {

    private Long id;

    @NotBlank
    private String objectConfirm;

    @NotBlank
    private String objectConfirmName;

    private Long taskId;
    private TaskConfirmStatusEnum status;
    private String reason;
    private List<String> files;

    public TaskConfirmDTO() {
        //Constructor
    }

    public TaskConfirmDTO(TaskConfirm taskConfirm) {
        BeanUtils.copyProperties(taskConfirm, this);
        this.files = JSONFactory.jsonToObject(taskConfirm.getFiles(), new TypeReference<List<String>>() {
        });
    }

    public TaskConfirmDTO(Long taskId, TaskConfirmObjectEnum confirmObject) {
        this.taskId = taskId;
        this.objectConfirm = confirmObject.getObjectConfirm();
        this.objectConfirmName = confirmObject.getDesc();
    }

    public TaskConfirm toEntity() {
        TaskConfirm taskConfirm = new TaskConfirm();
        BeanUtils.copyProperties(this, taskConfirm);
        taskConfirm.setFiles(JSONFactory.objectToJson(this.files));
        return taskConfirm;
    }
}
