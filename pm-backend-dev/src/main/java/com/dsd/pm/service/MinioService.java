package com.dsd.pm.service;

import com.dsd.pm.enums.MinioBucketEnum;
import com.dsd.pm.service.dto.DownloadFileRes;
import io.minio.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by sonba@itsol.vn
 * Date: 24/02/2021
 * Time: 21:35
 */
@Service
public class MinioService {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    private final MinioClient minioClient;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @PostConstruct
    void processCheckBucketExits() {
        for (MinioBucketEnum value : MinioBucketEnum.values()) {
            this.createdBucket(value.getBucketName());
        }
    }

    /**
     * CreatedBucket - Tao Bucket luu tru cho cac file upload
     *
     * @param bucketName Ten bucket
     */
    public void createdBucket(String bucketName) {
        try {
            // Make bucket name if not exist.
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName.toLowerCase()).build());
            if (!found) {
                // Make a new bucket called.
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName.toLowerCase()).build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String uploadFile(MultipartFile file, String bucketName) {
        String fileName = file.getOriginalFilename();
        String path = multipartToFile(file, fileName);
        if (path == null) {
            return null;
        }
        fileName = buildFileNameToMinio(fileName);
        String urlUpload;
        try {
            minioClient.uploadObject(UploadObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .filename(path)
                .build());
            urlUpload = bucketName + "/" + fileName;
            LOGGER.debug("Upload File To Minio Success: {}", fileName);
        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error("Upload File To Minio Failed: {}", e.getMessage());
            return null;
        }
        deleteFile(path);
        return urlUpload;
    }

    public Boolean deleteFileMinio(String bucketName, String fileName) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public DownloadFileRes downloadFile(String bucketName, String fileName) {
        String path = System.getProperty("java.io.tmpdir") + "/" + fileName;
        try {
            minioClient.downloadObject(DownloadObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .filename(path)
                .build());
            File file = new File(path);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            DownloadFileRes res = new DownloadFileRes(resource, file.length());
            deleteFile(path);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String buildFileNameToMinio(String name) {
        if (StringUtils.isEmpty(name)) {
            return "file-" + System.currentTimeMillis();
        }
        List<String> fileNames = Arrays.asList(name.split("\\."));
        String fileType = fileNames.get(fileNames.size() - 1);
        fileNames = fileNames.stream().filter(t -> !t.equalsIgnoreCase(fileType)).collect(Collectors.toList());
        String fileName = String.join(".", fileNames);
        return fileName + '-' + System.currentTimeMillis() + "." + fileType;
    }

    private String multipartToFile(MultipartFile multipart, String fileName) {
        try {
            File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            multipart.transferTo(convFile);
            return convFile.getPath();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void deleteFile(String path) {
        try {
            File myObj = new File(path);
            if (myObj.delete()) {
                LOGGER.debug("Deleted the file: {}", myObj.getName());
            } else {
                LOGGER.debug("Failed to delete the file.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
