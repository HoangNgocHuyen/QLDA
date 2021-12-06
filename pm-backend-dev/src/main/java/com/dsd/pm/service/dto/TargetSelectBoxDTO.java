package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TargetSelectBoxDTO {
    private Long id;
    private String title;
    private String code;
    private Long projectId;
    private String unitCode;

    public TargetSelectBoxDTO() {
    }

    public TargetSelectBoxDTO(Long id, String title, String code, Long projectId, String unitCode) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.projectId = projectId;
        this.unitCode = unitCode;
    }
}
