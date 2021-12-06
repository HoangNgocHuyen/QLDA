package com.dsd.pm.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PageExt<T> {

    private Long totalElements;
    private Integer totalPages;
    private List<T> content;

    public PageExt() {
    }

    /**
     * @param totalElements --- total elements
     * @param totalPages --- total page
     * @param content   --- content
     */
    public PageExt(Long totalElements, Integer totalPages, List<T> content) {
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.content = content;
    }
}
