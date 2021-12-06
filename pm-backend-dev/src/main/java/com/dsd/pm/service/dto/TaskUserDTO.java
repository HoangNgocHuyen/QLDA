package com.dsd.pm.service.dto;

import com.dsd.pm.domain.TaskUser;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotNull;

/**
 * Created by sonba@itsol.vn
 * Date: 29/05/2021
 * Time: 8:34 PM
 */
@Getter
@Setter
public class TaskUserDTO {

    private Long id;

    @NotNull
    private Long userId;
    private String username;
    private String fullName;
    private Long taskId;

    public TaskUserDTO() {
        //Constructor
    }

    public TaskUserDTO(Long userId, Long taskId) {
        this.userId = userId;
        this.taskId = taskId;
    }

    public TaskUserDTO(Long id, Long userId, String username, String fullName, Long taskId) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.taskId = taskId;
    }

    public TaskUser toEntity(){
        TaskUser taskUser = new TaskUser();
        BeanUtils.copyProperties(this, taskUser);
        return taskUser;
    }
}
