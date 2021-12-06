package com.dsd.pm.service.dto;

import com.dsd.pm.domain.enumeration.ProjectStatusEnum;
import com.dsd.pm.service.validator.RegionCodeExist;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for the {@link com.dsd.pm.domain.Project} entity.
 */
@Getter
@Setter
public class ProjectDTO implements Serializable {

    private Long id;

    @NotEmpty
    @Size(max = 100)
    private String code;

    @Size(max = 255)
    private String name;

    @NotNull
    private Long pmoUser;

    @NotEmpty
    @Size(max = 255)
    @RegionCodeExist
    private String area;

    @NotEmpty
    @Size(max = 255)
    @RegionCodeExist
    private String province;

    @Size(max = 255)
    @RegionCodeExist
    private String district;

    @NotEmpty
    @Size(max = 255)
    private String unit;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    @NotNull
    private ProjectStatusEnum status;

    private String note;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;
    private String pmoName;
    private String areaName;
    private String provinceName;
    private String districtName;

}
