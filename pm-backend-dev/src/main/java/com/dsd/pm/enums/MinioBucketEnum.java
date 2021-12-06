package com.dsd.pm.enums;

import lombok.Getter;

/**
 * Created by sonba@itsol.vn
 * Date: 26 / 02 / 2021
 * Time: 10:12 AM
 */
@Getter
public enum MinioBucketEnum {

    BUCKET_IMAGE("image", "Bucket Save Image"),
    BUCKET_VIDEO("video", "Bucket Save Video"),
    BUCKET_DOCUMENT("document", "Bucket Save Document"),
    BUCKET_REPORT("report", "Bucket Save Report"),
    BUCKET_REASON("reason", "Bucket Save Reason"),
    ;

    private final String bucketName;
    private final String desc;

    MinioBucketEnum(String bucketName, String desc) {
        this.bucketName = bucketName;
        this.desc = desc;
    }
}
