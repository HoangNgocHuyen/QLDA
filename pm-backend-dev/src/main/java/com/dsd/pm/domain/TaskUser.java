package com.dsd.pm.domain;

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
@Table(name = "task_user")
public class TaskUser extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_user_req")
    @SequenceGenerator(name = "task_user_req", sequenceName = "task_user_req")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "task_id")
    private Long taskId;
}
