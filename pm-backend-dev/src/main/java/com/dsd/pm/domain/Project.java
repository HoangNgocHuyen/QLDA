package com.dsd.pm.domain;

import com.dsd.pm.domain.enumeration.ProjectStatusEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;

/**
 * A Project.
 */
@Getter
@Setter
@Entity
@Table(
        name = "project"
)
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "code", length = 100, nullable = false, unique = true)
    private String code;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "pmo_user")
    private Long pmoUser;

    @Size(max = 255)
    @Column(name = "area", nullable = false)
    private String area;

    @Size(max = 255)
    @Column(name = "province", nullable = false)
    private String province;

    @Size(max = 255)
    @Column(name = "district")
    private String district;

    @NotNull
    @Size(max = 255)
    @Column(name = "unit", nullable = false)
    private String unit;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatusEnum status;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

}
