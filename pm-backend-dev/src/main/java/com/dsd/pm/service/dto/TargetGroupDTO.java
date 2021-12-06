package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.dsd.pm.domain.TargetGroup} entity.
 */
@Getter
@Setter
public class TargetGroupDTO implements Serializable {

    private Long id;

    @NotEmpty
    @Size(max = 100)
    private String code;

    @NotEmpty
    @Size(max = 255)
    private String name;

    private Instant createdAt;

    private String description;

    private String createdBy;

    private Instant updatedAt;

    private String updatedBy;

}
