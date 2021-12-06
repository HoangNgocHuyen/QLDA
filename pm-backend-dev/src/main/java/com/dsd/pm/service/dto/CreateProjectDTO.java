package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
public class CreateProjectDTO extends ProjectDTO {

    List<TargetGroupDTO> targetGroups;

    @NotNull
    List<AssigneeUserDTO> users;

}
