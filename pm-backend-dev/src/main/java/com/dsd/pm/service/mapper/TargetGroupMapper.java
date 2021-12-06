package com.dsd.pm.service.mapper;

import com.dsd.pm.domain.*;
import com.dsd.pm.service.dto.TargetGroupDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TargetGroup} and its DTO {@link TargetGroupDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TargetGroupMapper extends EntityMapper<TargetGroupDTO, TargetGroup> {}
