package com.dsd.pm.web.rest;

import com.dsd.pm.domain.User;
import com.dsd.pm.enums.RolesEnum;
import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.ProjectSearchDTO;
import com.dsd.pm.service.dto.TargetSearchDTO;
import com.dsd.pm.service.dto.TaskSearchDTO;

import java.util.ArrayList;
import java.util.List;

public class BaseResource {
    private final UserRepository userRepository;

    public BaseResource(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProjectSearchDTO projectSearchForm(ProjectSearchDTO form) {
        if (form == null) {
            form = new ProjectSearchDTO();
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Forbiden");
        }
        String role = SecurityUtils.getAuthorities().get(0);
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            form.setUnitCode(user.getUnitCode());
        } else if (RolesEnum.ROLE_EMPLOYEE.name().equals(role)) {
            form.setUnitCode(user.getUnitCode());
            form.setUserId(user.getId());
        }
        return form;
    }

    public TargetSearchDTO targetSearchForm(TargetSearchDTO form) {
        if (form == null) {
            form = new TargetSearchDTO();
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Forbiden");
        }
        String role = SecurityUtils.getAuthorities().get(0);
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            form.setUnitCode(user.getUnitCode());
        } else if (RolesEnum.ROLE_EMPLOYEE.name().equals(role)) {
            form.setUnitCode(user.getUnitCode());
            form.setUserId(user.getId());
        }
        return form;
    }

    public TaskSearchDTO taskSearchForm(TaskSearchDTO form) {
        if (form == null) {
            form = new TaskSearchDTO();
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Forbiden");
        }
        String role = SecurityUtils.getAuthorities().get(0);
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            List<Long> userIds = userRepository.getUserIdEmployeeByUnit(user.getUnitCode());
            if (userIds == null) {
                userIds = new ArrayList<>();
            }
            userIds.add(user.getId());
            form.setUserIds(userIds);
        } else if (RolesEnum.ROLE_EMPLOYEE.name().equals(role)) {
            form.setUserId(user.getId());
        }
        return form;
    }
}
