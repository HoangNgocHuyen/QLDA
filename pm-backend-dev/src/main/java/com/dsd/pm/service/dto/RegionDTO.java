package com.dsd.pm.service.dto;

import com.dsd.pm.domain.Region;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

/**
 * Created by sonba@itsol.vn
 * Date: 02/06/2021
 * Time: 10:30 PM
 */
@Getter
@Setter
public class RegionDTO {

    private String code;
    private String name;
    private String type;
    private String provinceCode;
    private String regionCode;

    public RegionDTO() {
        //Constructor
    }

    public RegionDTO(Region region) {
        this.code = region.getCode();
        this.name = region.getName();
        this.provinceCode = region.getProvinceCode();
        this.regionCode = region.getRegionCode();
    }

    public Region toEntity() {
        Region region = new Region();
        BeanUtils.copyProperties(this, region);
        return region;
    }
}
