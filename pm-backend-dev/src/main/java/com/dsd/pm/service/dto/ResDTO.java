package com.dsd.pm.service.dto;

import com.dsd.pm.enums.MessageEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResDTO<T> {

    private String code;
    private String desc;
    private T data;

    private ResDTO() {
    }

    private ResDTO(MessageEnum error) {
        this.setCode(error.getCode());
        this.setDesc(error.getMessage());
    }

    public static <T> ResDTO<T> success(T data) {
        ResDTO<T> res = new ResDTO<>(MessageEnum.OK);
        res.setData(data);
        return res;
    }

    public static <T> ResDTO<T> success() {
        return new ResDTO<>(MessageEnum.OK);
    }

    public static <T> ResDTO<T> error(MessageEnum message) {
        return new ResDTO<T>(message);
    }

    public static <T> ResDTO<T> error(MessageEnum message, T data) {
        ResDTO<T> res = new ResDTO<T>(message);
        res.setData(data);
        return res;
    }

    public static <T> ResDTO<T> error(String code, String desc, T data) {
        ResDTO<T> res = new ResDTO<T>();
        res.setCode(code);
        res.setDesc(desc);
        res.setData(data);
        return res;
    }
}
