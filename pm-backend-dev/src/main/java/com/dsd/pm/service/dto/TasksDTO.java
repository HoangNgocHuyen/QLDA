package com.dsd.pm.service.dto;

import com.dsd.pm.domain.TaskConfirm;
import com.dsd.pm.domain.TaskUser;
import com.dsd.pm.domain.Tasks;
import com.dsd.pm.enums.PriorityEnum;
import com.dsd.pm.enums.TaskConfirmObjectEnum;
import com.dsd.pm.enums.TaskStatusEnum;
import com.dsd.pm.enums.TaskTypeEnum;
import com.dsd.pm.service.util.DateUtils;
import com.dsd.pm.service.util.JSONFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by sonba@itsol.vn
 * Date: 27/05/2021
 * Time: 10:45 PM
 */
@Getter
@Setter
public class TasksDTO {

    private Long id;

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotNull
    private TaskTypeEnum type;

    @NotBlank
    private String projectCode;

    @NotBlank
    private String targetCode;

    private String taskParentCode;

    @NotNull
    private TaskStatusEnum status;

    @Valid
    @NotEmpty
    private List<TaskUserDTO> taskUsers;

    @Valid
    private List<TaskConfirmDTO> taskConfirms;

    private Instant startDate;
    private Instant endDate;
    private String note;
    private String reason;
    private Double estimatedTime;
    private Double spentTime;
    private PriorityEnum priority;
    private Double donePercent;
    private Instant startTime;
    private Instant endTime;
    private Instant dateMeeting;
    private String location;
    private String programme;
    private List<String> document;
    private String device;
    private String chairedMeeting;
    private String secretary;
    private List<String> reportMeeting;
    private List<String> image;
    private List<String> video;
    private boolean detail;

    public TasksDTO() {
        //Constructor
    }

    public TasksDTO(Tasks tasks) {
        BeanUtils.copyProperties(tasks, this);
        this.document = JSONFactory.jsonToObject(tasks.getDocument(), new TypeReference<List<String>>() {
        });
        this.reportMeeting = JSONFactory.jsonToObject(tasks.getReportMeeting(), new TypeReference<List<String>>() {
        });
        this.image = JSONFactory.jsonToObject(tasks.getImage(), new TypeReference<List<String>>() {
        });
        this.video = JSONFactory.jsonToObject(tasks.getVideo(), new TypeReference<List<String>>() {
        });
    }

    public Tasks toEntity(Long id) {
        Tasks tasks = new Tasks();
        BeanUtils.copyProperties(this, tasks);
        tasks.setId(id);
        if (TaskTypeEnum.WORK.equals(tasks.getType())) {
            tasks.setEstimatedTime(DateUtils.calculatorTotalTime(tasks.getStartDate(), tasks.getEndDate(), false));
            tasks.setSpentTime(DateUtils.calculatorTotalTime(tasks.getStartDate(), tasks.getEndDate(), true));
        }
        tasks.setDocument(JSONFactory.objectToJson(this.document));
        tasks.setReportMeeting(JSONFactory.objectToJson(this.reportMeeting));
        tasks.setImage(JSONFactory.objectToJson(this.image));
        tasks.setVideo(JSONFactory.objectToJson(this.video));
        return tasks;
    }

    public List<TaskUser> toTaskUsersEntity(Long taskId) {
        List<TaskUser> lst = new ArrayList<>();
        for (TaskUserDTO t : taskUsers) {
            t.setId(null);
            t.setTaskId(taskId);
            lst.add(t.toEntity());
        }
        return lst;
    }

    public List<TaskConfirm> toTaskConfirmEntity(Long taskId) {
        if (this.taskParentCode != null && !this.taskParentCode.isEmpty()) {
            return null;
        }
        if (this.taskConfirms == null || this.taskConfirms.isEmpty()) {
            this.taskConfirms = TaskConfirmObjectEnum.getListObjectConfirm(taskId);
        }
        this.taskConfirms.forEach(t -> {
            t.setTaskId(taskId);
        });
        return this.taskConfirms.stream().map(TaskConfirmDTO::toEntity).collect(Collectors.toList());
    }
}
