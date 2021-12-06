package com.dsd.pm.domain;

import com.dsd.pm.enums.PriorityEnum;
import com.dsd.pm.enums.TaskStatusEnum;
import com.dsd.pm.enums.TaskTypeEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A Tasks.
 */
@Getter
@Setter
@Entity
@Table(name = "tasks")
public class Tasks extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tasks_req")
    @SequenceGenerator(name = "tasks_req", sequenceName = "tasks_req", allocationSize = 1)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private TaskTypeEnum type;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "target_code")
    private String targetCode;

    @Column(name = "task_parent_code")
    private String taskParentCode;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TaskStatusEnum status;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "note")
    private String note;

    @Column(name = "reason")
    private String reason;

    @Column(name = "estimated_time")
    private Long estimatedTime;

    @Column(name = "spent_time")
    private Long spentTime;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private PriorityEnum priority;

    @Column(name = "done_percent")
    private Double donePercent;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "date_meeting")
    private Instant dateMeeting;

    @Column(name = "location")
    private String location;

    @Column(name = "programme")
    private String programme;

    @Column(name = "document")
    private String document;

    @Column(name = "device")
    private String device;

    @Column(name = "chaired_meeting")
    private String chairedMeeting;

    @Column(name = "secretary")
    private String secretary;

    @Column(name = "report")
    private String reportMeeting;

    @Column(name = "image")
    private String image;

    @Column(name = "video")
    private String video;
}
