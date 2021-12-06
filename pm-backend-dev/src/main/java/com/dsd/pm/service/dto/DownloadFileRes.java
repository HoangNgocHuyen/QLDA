package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.InputStreamResource;

/**
 * Created by sonba@itsol.vn
 * Date: 03/06/2021
 * Time: 10:29 PM
 */
@Getter
@Setter
public class DownloadFileRes {

    private InputStreamResource inputStreamResource;
    private Long contentLength;

    public DownloadFileRes(InputStreamResource inputStreamResource, Long contentLength) {
        this.inputStreamResource = inputStreamResource;
        this.contentLength = contentLength;
    }
}
