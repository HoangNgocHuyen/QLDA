package com.dsd.pm.service;

import com.dsd.pm.domain.*;
import com.dsd.pm.enums.DataConfigEnum;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.enums.RolesEnum;
import com.dsd.pm.enums.UnitStatusEnum;
import com.dsd.pm.repository.ProjectRepository;
import com.dsd.pm.repository.ProjectUserRepository;
import com.dsd.pm.repository.UnitRepository;
import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.ResDTO;
import com.dsd.pm.service.dto.TargetGroupDTO;
import com.dsd.pm.service.dto.UnitDTO;
import com.dsd.pm.web.rest.errors.ApiException;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.time.Instant;
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
public class UnitService {

    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final UnitRepository unitRepository;
    private final EntityManager entityManager;
    private final UserRepository userRepository;

    public UnitService(ProjectRepository projectRepository, ProjectUserRepository projectUserRepository, UnitRepository unitRepository,
                       EntityManager entityManager, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.projectUserRepository = projectUserRepository;
        this.unitRepository = unitRepository;
        this.entityManager = entityManager;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UnitDTO> findAllUnits() {
        String role = SecurityUtils.getAuthorities().get(0);
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            List<UnitDTO> res = new ArrayList<>();
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
            if (user == null) {
                return res;
            }
            Unit unit = unitRepository.findByUnitCode(user.getUnitCode()).orElse(null);
            if (unit == null) {
                return res;
            }
            UnitDTO dto = new UnitDTO();
            dto.setUnitCode(unit.getUnitCode());
            dto.setUnitName(unit.getUnitName());
            res.add(dto);
            return res;
        } else {
            return unitRepository.findAll()
                .stream().map(UnitDTO::new).collect(Collectors.toList());
        }
    }

    @Transactional(readOnly = true)
    public List<UnitDTO> getUnitByProjectCode(String projectCode) {
        Project project = projectRepository.findByCode(projectCode).orElse(null);
        if (project == null) {
            throw new ApiException(MessageEnum.PROJECT_NOT_FOUND);
        }
        List<Long> userIds = projectUserRepository.findUserIdByProjectCode(projectCode);
        List<User> users = userRepository.findByIdIn(userIds);
        List<String> uniCodes = users.stream().map(User::getUnitCode).collect(Collectors.toList());
        uniCodes.add(project.getUnit());
        List<Unit> units = unitRepository.findByUnitCodeIn(uniCodes);
        return units.stream().map(UnitDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UnitDTO> searchUnit(Pageable pageable, UnitDTO dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Unit> query = cb.createQuery(Unit.class);
        Root<Unit> units = query.from(Unit.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.notEqual(units.get(Unit_.STATUS).as(UnitStatusEnum.class), UnitStatusEnum.DELETE));
        if (dto.getUnitCode() != null && !dto.getUnitCode().isEmpty()) {
            predicates.add(cb.equal(units.get(Unit_.UNIT_CODE), dto.getUnitCode().toUpperCase()));
        }
        if (dto.getUnitName() != null && !dto.getUnitName().isEmpty()) {
            predicates.add(cb.like(cb.lower(units.get(Unit_.UNIT_NAME)), "%" + dto.getUnitName().toLowerCase() + "%"));
        }

        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(units.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        List<Unit> jobs = entityManager.createQuery(query)
                .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // select count(*) from jobs
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(Unit.class)))
                .where(predicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(
                jobs.stream().map(UnitDTO::new).collect(Collectors.toList()),
                pageable,
                total);
    }

    public UnitDTO createdUnit(UnitDTO dto) {
        Optional<Unit> item = unitRepository.findByUnitCode(dto.getUnitCode());
        if (item.isPresent()) {
            throw new ApiException(MessageEnum.ALREADY_EXITS.format("Mã đơn vị đã tồn tại"));
        }
        Unit unit = dto.toEntity();
        unit.setStatus(UnitStatusEnum.ACTIVE);
        unit = unitRepository.save(unit);
        return new UnitDTO(unit);
    }

    public UnitDTO updateUnit(UnitDTO dto) {
        Optional<Unit> item = unitRepository.findByUnitCode(dto.getUnitCode());
        if (!item.isPresent()) {
            throw new ApiException(MessageEnum.NOT_FOUND.format("Đơn vị không tồn tại"));
        }
        Unit unit = dto.toEntity();
        unit = unitRepository.save(unit);
        return new UnitDTO(unit);
    }

    public ResDTO<Void> deleteUnit(String unitCode) {
        Unit unit = unitRepository.findByUnitCode(unitCode).orElse(null);
        if (unit == null) {
            return ResDTO.error(MessageEnum.NOT_FOUND);
        }
        unit.setStatus(UnitStatusEnum.DELETE);
        unitRepository.save(unit);
        return ResDTO.success();
    }

    @PostConstruct
    public void createdUserAdminDefaultData() {
        if (!unitRepository.findByUnitCode(DataConfigEnum.UNIT_S101.getCode()).isPresent()) {
            Unit unit = new Unit();
            unit.setUnitCode(DataConfigEnum.UNIT_S101.getCode());
            unit.setUnitName(DataConfigEnum.UNIT_S101.getName());
            unit.setCreatedBy(DataConfigEnum.USER_ADMIN.getCode());
            unit.setCreatedDate(Instant.now());
            unit.setLastModifiedBy(DataConfigEnum.USER_ADMIN.getCode());
            unit.setLastModifiedDate(Instant.now());
            unitRepository.save(unit);
        }
    }
}
