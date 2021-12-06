package com.dsd.pm.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * Created by sonba@itsol.vn
 * Date: 24/02/2021
 * Time: 21:32
 */
@Component
@Configuration
public class MinioConfig {

    private final ApplicationProperties applicationProperties;

    public MinioConfig(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
            .endpoint(applicationProperties.getMinio().getEndpoint())
            .credentials(applicationProperties.getMinio().getAccessKey(), applicationProperties.getMinio().getSecretKey())
            .build();
    }
}
