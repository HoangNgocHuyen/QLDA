package com.dsd.pm.service.validator;

import com.dsd.pm.service.RegionService;
import com.dsd.pm.service.dto.RegionDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class RegionCodeValidator implements ConstraintValidator<RegionCodeExist, String> {

    @Autowired
    private RegionService regionService;

    @Override
    public void initialize(RegionCodeExist constraintAnnotation) {

    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(s)) {
            return true;
        }
        RegionDTO code = regionService.findAllRegion().parallelStream()
                .filter(r -> r.getCode().equals(s)).findFirst().orElse(null);
        return code != null;
    }

}
