package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class CsvDTO {
    private final Map<String,String> errors = new HashMap<>();
    private boolean valid = true;
    private boolean existed = false;
    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(String key, String code) {
        this.errors.put(key, code);
        this.valid = false;
    }
}
