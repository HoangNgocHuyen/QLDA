package com.dsd.pm.domain;

import com.dsd.pm.enums.UnitStatusEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A user.
 */
@Getter
@Setter
@Entity
@Table(name = "unit")
public class Unit extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "unit_code", length = 50, unique = true, nullable = false)
    private String unitCode;

    @Column(name = "unit_name")
    private String unitName;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private UnitStatusEnum status;

}
