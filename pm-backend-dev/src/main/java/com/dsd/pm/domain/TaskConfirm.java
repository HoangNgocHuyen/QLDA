package com.dsd.pm.domain;

import com.dsd.pm.enums.TaskConfirmStatusEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A Tasks.
 */
@Getter
@Setter
@Entity
@Table(name = "task_confirm")
public class TaskConfirm extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_confirm_req")
    @SequenceGenerator(name = "task_confirm_req", sequenceName = "task_confirm_req")
    private Long id;

    @Column(name = "object_confirm")
    private String objectConfirm;

    @Column(name = "object_confirm_name")
    private String objectConfirmName;

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TaskConfirmStatusEnum status;

    @Column(name = "reason")
    private String reason;

    @Column(name = "files")
    private String files;
}
