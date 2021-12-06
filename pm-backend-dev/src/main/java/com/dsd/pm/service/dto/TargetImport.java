package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class TargetImport {
    private MultipartFile file;
    private List<TargetDTO> data;
    private boolean valid = true;
    private String errorMessage = null;
}
