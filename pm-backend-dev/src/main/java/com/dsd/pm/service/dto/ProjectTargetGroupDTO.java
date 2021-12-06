package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DTO for the {@link com.dsd.pm.domain.TargetGroup} entity.
 */
@Getter
@Setter
public class ProjectTargetGroupDTO implements Serializable {

    private Long id;

    @NotEmpty
    @Size(max = 100)
    private String projectCode;

    @NotEmpty
    @Size(max = 100)
    private String targetGroupCode;

    private Instant createdAt;

    private String createdBy;

    private Instant updatedAt;

    private String updatedBy;

}
