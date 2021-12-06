package com.dsd.pm.repository;

import com.dsd.pm.domain.Region;
import com.dsd.pm.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {

    Optional<Region> findByCode(String code);

    Optional<List<Region>> findAllByProvinceCode(String provinceCode);

    List<Region> findAllByRegionCodeIsNullAndProvinceCodeIsNull();

    List<Region> findAllByRegionCodeIsNotNullAndProvinceCodeIsNull();

    List<Region> findAllByRegionCodeIsNotNullAndProvinceCodeIsNotNull();
}
