package com.dsd.pm.web.rest;

import com.dsd.pm.service.MinioService;
import com.dsd.pm.service.dto.DownloadFileRes;
import com.dsd.pm.service.dto.ResDTO;
import com.dsd.pm.service.dto.UploadFileRequest;
import com.dsd.pm.service.util.FileUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletContext;
import javax.validation.Valid;

/**
 * Created by sonba@itsol.vn
 * Date: 03/06/2021
 * Time: 10:10 PM
 */
@RestController
@RequestMapping(value = "api/pm")
public class StorageResource {

    private final ServletContext servletContext;
    private final MinioService minioService;

    public StorageResource(ServletContext servletContext,
                           MinioService minioService) {
        this.servletContext = servletContext;
        this.minioService = minioService;
    }

    @RequestMapping(value = "/upload-file", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResDTO<String>> uploadFile(@Valid UploadFileRequest req) {
        String res = minioService.uploadFile(req.getFile(), req.getBucketName().getBucketName());
        return new ResponseEntity<>(ResDTO.success(res), HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{bucketName}/{fileName}")
    ResponseEntity<ResDTO<Boolean>> deleteFile(@PathVariable String bucketName, @PathVariable String fileName) {
        Boolean res = minioService.deleteFileMinio(bucketName, fileName);
        return new ResponseEntity<>(ResDTO.success(res), HttpStatus.OK);
    }

    @GetMapping(value = "/download/{bucketName}/{fileName}")
    public @ResponseBody
    ResponseEntity<InputStreamResource> getImageWithMediaType(@PathVariable String bucketName, @PathVariable String fileName) {
        MediaType mediaType = FileUtils.getMediaTypeForFileName(this.servletContext, fileName);
        DownloadFileRes resource = minioService.downloadFile(bucketName, fileName);
        return ResponseEntity.ok()
            // Content-Disposition
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName)
            // Content-Type
            .contentType(mediaType)
            // Content-Length
            .contentLength(resource.getContentLength())
            .body(resource.getInputStreamResource());
    }
}
