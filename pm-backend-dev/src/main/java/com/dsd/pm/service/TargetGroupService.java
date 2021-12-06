package com.dsd.pm.service;

import com.dsd.pm.domain.*;
import com.dsd.pm.domain.enumeration.ProjectStatusEnum;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.enums.TargetGroupStatusEnum;
import com.dsd.pm.repository.ProjectTargetGroupRepository;
import com.dsd.pm.repository.TargetGroupRepository;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.ProTargetGroupDTO;
import com.dsd.pm.service.dto.ResDTO;
import com.dsd.pm.service.dto.TargetGroupDTO;
import com.dsd.pm.service.dto.UnitDTO;
import com.dsd.pm.service.mapper.TargetGroupMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.util.BeanUtil;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;

@Service
@Transactional
public class TargetGroupService {

    private final Logger log = LoggerFactory.getLogger(TargetGroupService.class);

    private final TargetGroupRepository targetGroupRepository;
    private final ProjectTargetGroupRepository projectTargetGroupRepository;
    private final EntityManager entityManager;
    private final TargetGroupMapper targetGroupMapper;

    public TargetGroupService(TargetGroupRepository targetGroupRepository, ProjectTargetGroupRepository projectTargetGroupRepository, EntityManager entityManager, TargetGroupMapper targetGroupMapper) {
        this.targetGroupRepository = targetGroupRepository;
        this.projectTargetGroupRepository = projectTargetGroupRepository;
        this.entityManager = entityManager;
        this.targetGroupMapper = targetGroupMapper;
    }

    public ResDTO<Void> save(TargetGroupDTO dto) {
        TargetGroup targetGroup = dto.getId() == null ? new TargetGroup() : targetGroupRepository.findById(dto.getId()).orElse(null);
        if (targetGroup == null) {
            return ResDTO.error(MessageEnum.NOT_FOUND);
        }
        TargetGroup checkCode = targetGroupRepository.findByCode(dto.getCode()).orElse(null);
        if (checkCode != null && (dto.getId() == null || !targetGroup.getCode().equals(dto.getCode()))) {
            return ResDTO.error(MessageEnum.CODE_EXIST.format(dto.getId()));
        }
        if (dto.getId() == null) {
            targetGroup.setCreatedAt(Instant.now());
            targetGroup.setCreatedBy(SecurityUtils.getCurrentUser());
            targetGroup.setStatus(TargetGroupStatusEnum.ACTIVE);
            targetGroup.setCode(dto.getCode());
        } else {
            targetGroup.setUpdatedAt(Instant.now());
            targetGroup.setUpdatedBy(SecurityUtils.getCurrentUser());
        }
        targetGroup.setName(dto.getName());
        targetGroup.setDescription(dto.getDescription());
        targetGroup = targetGroupRepository.save(targetGroup);
        targetGroupMapper.toDto(targetGroup);
        return ResDTO.success();
    }

    @Transactional(readOnly = true)
    public List<TargetGroupDTO> findAll() {
        return targetGroupRepository.findByStatusNot(TargetGroupStatusEnum.DELETE).stream().map(targetGroupMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Transactional(readOnly = true)
    public Optional<TargetGroupDTO> findOne(Long id) {
        return targetGroupRepository.findById(id).map(targetGroupMapper::toDto);
    }

    public ResDTO<Void> delete(Long id) {
        TargetGroup targetGroup = targetGroupRepository.findById(id).orElse(null);
        if (targetGroup == null) {
            return ResDTO.error(MessageEnum.NOT_FOUND);
        }
        targetGroup.setStatus(TargetGroupStatusEnum.DELETE);
        targetGroup.setUpdatedAt(Instant.now());
        targetGroup.setUpdatedBy(SecurityUtils.getCurrentUser());
        return ResDTO.success();
    }

    @Transactional(readOnly = true)
    public List<ProTargetGroupDTO> getTargetGroupByProject(String projectCode) {
        return projectTargetGroupRepository.getTargetGroupByProject(projectCode);
    }

    @Transactional(readOnly = true)
    public Page<TargetGroupDTO> searchTargetGroup(Pageable pageable, TargetGroupDTO dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TargetGroup> query = cb.createQuery(TargetGroup.class);
        Root<TargetGroup> targetGr = query.from(TargetGroup.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.notEqual(targetGr.get(TargetGroup_.STATUS).as(TargetGroupStatusEnum.class), TargetGroupStatusEnum.DELETE));
        if (StringUtils.isNotBlank(dto.getCode())) {
            predicates.add(cb.equal(targetGr.get(TargetGroup_.CODE), dto.getCode().toUpperCase()));
        }
        if (StringUtils.isNotBlank(dto.getName())) {
            predicates.add(cb.like(cb.lower(targetGr.get(TargetGroup_.NAME)), "%" + dto.getName().toLowerCase() + "%"));
        }
        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(targetGr.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        List<TargetGroup> jobs = entityManager.createQuery(query)
            .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        // select count(*) from jobs
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(TargetGroup.class)))
            .where(predicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(
            jobs.stream().map(targetGroupMapper::toDto).collect(Collectors.toList()),
            pageable,
            total)
        ;
    }
}
