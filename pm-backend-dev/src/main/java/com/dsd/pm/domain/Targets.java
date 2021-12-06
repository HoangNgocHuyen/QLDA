package com.dsd.pm.domain;

import com.dsd.pm.enums.TargetStatusEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;


/**
 * A {@link Targets}.
 */
@Getter
@Setter
@Entity
@Table(name = "targets")
public class Targets implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "code")
    private String code;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "number_day")
    private Integer numberDay;

    @Column(name = "number_day_working")
    private Integer numberDayWorking;

    @Column(name = "number_meeting")
    private Integer numberMeeting;

    @Column(name = "unit_code")
    private String unitCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TargetStatusEnum status;

    @Column(name = "done_percent")
    private Integer donePercent;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "closed_by")
    private String closedBy;

}
