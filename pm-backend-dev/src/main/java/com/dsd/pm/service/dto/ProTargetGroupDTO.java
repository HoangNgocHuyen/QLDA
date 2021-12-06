package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProTargetGroupDTO {

    private String projectCode;
    private String projectName;
    private Long projectId;
    private String groupCode;
    private String groupName;
    private Long groupId;

    public ProTargetGroupDTO() {
    }

    public ProTargetGroupDTO(String projectCode, String projectName, Long projectId, String groupCode, String groupName, Long groupId) {
        this.projectCode = projectCode;
        this.projectName = projectName;
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.groupName = groupName;
        this.groupId = groupId;
    }
}
