package com.dsd.pm.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;


/**
 * A {@link ProjectTargetGroup}.
 */
@Getter
@Setter
@Entity
@Table(
        name = "project_target_group",
        indexes = {
                @Index(name = "idx_pro_tg_code", columnList = "project_code, target_group_code", unique = true),
        }
)
public class ProjectTargetGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "target_group_code")
    private String targetGroupCode;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "created_by")
    private String createdBy;

}
