package com.dsd.pm.service;

import com.dsd.pm.domain.Region;
import com.dsd.pm.domain.Region_;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.repository.RegionRepository;
import com.dsd.pm.service.dto.RegionDTO;
import com.dsd.pm.web.rest.errors.ApiException;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by sonba@itsol.vn
 * Date: 25/05/2021
 * Time: 8:52 PM
 */
@Service
@Transactional
public class RegionService {

    private final RegionRepository regionRepository;
    private final EntityManager entityManager;

    public RegionService(RegionRepository regionRepository,
                         EntityManager entityManager) {
        this.regionRepository = regionRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public List<RegionDTO> findAllRegion() {
        return regionRepository.findAll().stream().map(RegionDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegionDTO> findAllArea() {
        return regionRepository.findAllByRegionCodeIsNullAndProvinceCodeIsNull().stream().map(RegionDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegionDTO> findAllProvince() {
        return regionRepository.findAllByRegionCodeIsNotNullAndProvinceCodeIsNull().stream().map(RegionDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegionDTO> findAllDistrict() {
        return regionRepository.findAllByRegionCodeIsNotNullAndProvinceCodeIsNotNull().stream().map(RegionDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<RegionDTO> searchRegion(Pageable pageable, RegionDTO dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Region> query = cb.createQuery(Region.class);
        Root<Region> areaRoot = query.from(Region.class);

        List<Predicate> predicates = new ArrayList<>();
        if (dto.getType() != null && !dto.getType().isEmpty()) {
            if (dto.getType().equalsIgnoreCase("AREA")) {
                predicates.add(cb.isNull(areaRoot.get(Region_.REGION_CODE)));
                predicates.add(cb.isNull(areaRoot.get(Region_.PROVINCE_CODE)));
            } else if (dto.getType().equalsIgnoreCase("PROVINCE")) {
                predicates.add(cb.isNotNull(areaRoot.get(Region_.REGION_CODE)));
                predicates.add(cb.isNull(areaRoot.get(Region_.PROVINCE_CODE)));
            } else {
                predicates.add(cb.isNotNull(areaRoot.get(Region_.REGION_CODE)));
                predicates.add(cb.isNotNull(areaRoot.get(Region_.PROVINCE_CODE)));
            }
        }
        if (dto.getCode() != null && !dto.getCode().isEmpty()) {
            predicates.add(cb.equal(areaRoot.get(Region_.CODE), dto.getCode().toUpperCase()));
        }
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            predicates.add(cb.like(cb.lower(areaRoot.get(Region_.NAME)), "%" + dto.getName().toLowerCase() + "%"));
        }
        if (dto.getProvinceCode() != null) {
            predicates.add(cb.equal(areaRoot.get(Region_.PROVINCE_CODE), dto.getProvinceCode()));
        }
        if (dto.getRegionCode() != null) {
            predicates.add(cb.equal(areaRoot.get(Region_.REGION_CODE), dto.getRegionCode()));
        }

        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(areaRoot.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        List<Region> jobs = entityManager.createQuery(query)
            .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        // select count(*) from jobs
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(Region.class)))
            .where(predicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(
            jobs.stream().map(RegionDTO::new).collect(Collectors.toList()),
            pageable,
            total);
    }

    public RegionDTO createdRegion(RegionDTO dto) {
        Optional<Region> item = regionRepository.findByCode(dto.getCode());
        if (item.isPresent()) {
            throw new ApiException(MessageEnum.ALREADY_EXITS.format("Mã khu vực đã tồn tại"));
        }
        Region region = dto.toEntity();
        region = regionRepository.save(region);
        return new RegionDTO(region);
    }

    public RegionDTO updateRegion(RegionDTO dto) {
        Optional<Region> item = regionRepository.findByCode(dto.getCode());
        if (!item.isPresent()) {
            throw new ApiException(MessageEnum.NOT_FOUND.format("Khu vực không tồn tại"));
        }
        Region region = dto.toEntity();
        region = regionRepository.save(region);
        return new RegionDTO(region);
    }

    public void deleteRegion(String code) {
        regionRepository.findByCode(code).ifPresent(regionRepository::delete);
        regionRepository.findAllByProvinceCode(code).ifPresent(regionRepository::deleteAll);
    }
}
