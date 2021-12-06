package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SearchBase {
    private String area;
    private String district;
    private String province;
    private String unitCode;
    private Long userId;
    private List<Long> userIds;
}
