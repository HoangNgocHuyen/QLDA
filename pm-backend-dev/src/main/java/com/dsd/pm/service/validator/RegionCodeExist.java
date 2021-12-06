package com.dsd.pm.service.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RegionCodeValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RegionCodeExist {

    String message() default "Region code does not exist";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
