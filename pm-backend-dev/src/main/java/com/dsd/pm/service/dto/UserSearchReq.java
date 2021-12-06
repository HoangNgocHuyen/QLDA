package com.dsd.pm.service.dto;

import com.dsd.pm.enums.PositionEnum;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by sonba@itsol.vn
 * Date: 23/05/2021
 * Time: 10:42 AM
 */
@Getter
@Setter
public class UserSearchReq {

    private String login;
    private String fullName;
    private String email;
    private Boolean activated;
    private String mobile;
    private PositionEnum position;
    private String unitCode;
}
