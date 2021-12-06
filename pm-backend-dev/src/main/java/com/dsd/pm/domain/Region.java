package com.dsd.pm.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * A user.
 */
@Getter
@Setter
@Entity
@Table(name = "region")
public class Region extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "code", length = 50, unique = true, nullable = false)
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "province_code")
    private String provinceCode;

    @Column(name = "region_code")
    private String regionCode;
}
