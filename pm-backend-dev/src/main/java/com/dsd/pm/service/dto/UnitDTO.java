package com.dsd.pm.service.dto;

import com.dsd.pm.domain.Unit;
import com.dsd.pm.enums.UnitStatusEnum;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Created by sonba@itsol.vn
 * Date: 25/05/2021
 * Time: 8:49 PM
 */
@Getter
@Setter
public class UnitDTO {

    @NotBlank
    private String unitCode;

    @NotBlank
    private String unitName;

    public UnitDTO() {
        // Constructor
    }

    public UnitDTO(Unit unit) {
        this.unitCode = unit.getUnitCode();
        this.unitName = unit.getUnitName();
    }

    public Unit toEntity() {
        Unit unit = new Unit();
        BeanUtils.copyProperties(this, unit);
        return unit;
    }
}
