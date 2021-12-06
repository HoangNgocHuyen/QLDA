package com.dsd.pm.service.dto;

import com.dsd.pm.domain.Authority;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class AssigneeUserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String login;
    private String mobile;
    private String unitCode;
    private Set<String> authorities;

    public AssigneeUserDTO() {
    }

    public AssigneeUserDTO(Long id, String login, String fullName, String email, String mobile, String unitCode) {
        this.id = id;
        this.login = login;
        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.unitCode = unitCode;
    }
}
