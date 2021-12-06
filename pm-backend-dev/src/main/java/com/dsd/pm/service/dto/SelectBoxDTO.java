package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SelectBoxDTO {
    private Long id;
    private String name;
    private String code;

    public SelectBoxDTO() {
    }

    public SelectBoxDTO(Long id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
