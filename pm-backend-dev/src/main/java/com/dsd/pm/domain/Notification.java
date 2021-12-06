package com.dsd.pm.domain;

import com.dsd.pm.enums.NotifyStatusEnum;
import com.dsd.pm.enums.NotifyTypeEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "notification")
public class Notification extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "username")
    private String username;

    @Column(name = "unit_code")
    private String unitCode;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "task_code")
    private String taskCode;

    @Column(name = "list_username")
    private String listUsername;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotifyTypeEnum type;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotifyStatusEnum status;

}
