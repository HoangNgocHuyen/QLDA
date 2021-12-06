package com.dsd.pm.service.dto;

import com.dsd.pm.enums.MinioBucketEnum;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class UploadFileRequest {

    @NotNull
    private MultipartFile file;

    @NotNull
    private MinioBucketEnum bucketName;
}
