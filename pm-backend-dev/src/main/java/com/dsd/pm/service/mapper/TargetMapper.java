package com.dsd.pm.service.mapper;

import com.dsd.pm.domain.*;
import com.dsd.pm.service.dto.TargetDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Targets} and its DTO {@link TargetDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TargetMapper extends EntityMapper<TargetDTO, Targets> {



    default Targets fromId(Long id) {
        if (id == null) {
            return null;
        }
        Targets targets = new Targets();
        targets.setId(id);
        return targets;
    }
}
