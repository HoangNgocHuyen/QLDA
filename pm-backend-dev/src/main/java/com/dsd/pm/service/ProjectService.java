package com.dsd.pm.service;

import com.dsd.pm.domain.*;
import com.dsd.pm.domain.enumeration.ProjectStatusEnum;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.enums.RolesEnum;
import com.dsd.pm.repository.*;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.service.mapper.ProjectMapper;
import com.dsd.pm.service.util.DateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
@Transactional
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final EntityManager em;
    private final ProjectTargetGroupRepository projectTargetGroupRepository;
    private final ProjectUserRepository projectUserRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          ProjectMapper projectMapper,
                          RegionRepository regionRepository, EntityManager em,
                          ProjectTargetGroupRepository projectTargetGroupRepository, ProjectUserRepository projectUserRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
        this.regionRepository = regionRepository;
        this.em = em;
        this.projectTargetGroupRepository = projectTargetGroupRepository;
        this.projectUserRepository = projectUserRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    public ResDTO<Void> save(CreateProjectDTO dto) {
        Project project = dto.getId() == null ? new Project() : projectRepository.findById(dto.getId()).orElse(null);
        if (project == null) {
            return ResDTO.error(MessageEnum.NOT_FOUND.format(dto.getId()));
        }
        Project checkCode = projectRepository.findByCode(dto.getCode()).orElse(null);
        if (checkCode != null && (dto.getId() == null || !project.getCode().equals(dto.getCode()))) {
            return ResDTO.error(MessageEnum.CODE_EXIST.format(dto.getId()));
        }

        String[] ignores = new String[]{"id", "createdAt", "createdBy", "updatedAt", "updatedBy", "status"};

        BeanUtils.copyProperties(dto, project, ignores);
        String userLogin = SecurityUtils.getCurrentUser();
        if (dto.getId() != null) {
            project.setUpdatedAt(Instant.now());
            project.setUpdatedBy(userLogin);
            String role = SecurityUtils.getAuthorities().get(0);
            if (RolesEnum.ROLE_LEADER_SPECIAL.name().equals(role) || (RolesEnum.ROLE_LEADER.name().equals(role) && userLogin.equals(project.getCreatedBy()))) {
                project.setStatus(dto.getStatus());
            }
        } else {
            project.setStatus(ProjectStatusEnum.ACTIVE);
            project.setCreatedAt(Instant.now());
            project.setCreatedBy(userLogin);
        }
        project = projectRepository.save(project);
        this.saveProjectTargetGroup(dto.getTargetGroups(), project.getCode());
        this.saveProjectUser(dto.getUsers(), project.getCode());
        return ResDTO.success();
    }

    private void saveProjectUser(List<AssigneeUserDTO> dtos, String proCode) {
        List<Long> userIds = dtos.stream().map(AssigneeUserDTO::getId).collect(Collectors.toList());

        List<ProjectUser> old = projectUserRepository.findByProjectCode(proCode);
        List<Long> oldUserIds = old.stream().map(ProjectUser::getUserId).collect(Collectors.toList());

        List<Long> delUserIds = oldUserIds.stream().filter(o -> !userIds.contains(o)).collect(Collectors.toList());
        projectUserRepository.deleteByProjectCodeAndUserIdIn(proCode, delUserIds);
        List<Long> insertCodes = userIds.stream().filter(n -> !oldUserIds.contains(n)).collect(Collectors.toList());
        List<ProjectUser> lstInsert = new ArrayList<>();
        insertCodes.forEach(i -> {
            ProjectUser ptg = new ProjectUser();
            ptg.setProjectCode(proCode);
            ptg.setUserId(i);
            ptg.setCreatedAt(Instant.now());
            ptg.setCreatedBy(SecurityUtils.getCurrentUser());

            lstInsert.add(ptg);
        });

        if (lstInsert.size() > 0) {
            projectUserRepository.saveAll(lstInsert);
        }
    }

    private void saveProjectTargetGroup(List<TargetGroupDTO> dtos, String projectCode) {

        List<String> newCodes = dtos.stream().map(TargetGroupDTO::getCode).collect(Collectors.toList());
        List<ProjectTargetGroup> old = projectTargetGroupRepository.findByProjectCode(projectCode);
        List<String> oldCodes = old.stream().map(ProjectTargetGroup::getTargetGroupCode).collect(Collectors.toList());

        List<String> delCodes = oldCodes.stream().filter(o -> !newCodes.contains(o)).collect(Collectors.toList());
        projectTargetGroupRepository.deleteByProjectCodeAndTargetGroupCodeIn(projectCode, delCodes);

        List<String> insertCodes = newCodes.stream().filter(n -> !oldCodes.contains(n)).collect(Collectors.toList());
        List<ProjectTargetGroup> lstInsert = new ArrayList<>();
        insertCodes.forEach(i -> {
            ProjectTargetGroup ptg = new ProjectTargetGroup();
            ptg.setProjectCode(projectCode);
            ptg.setTargetGroupCode(i);
            ptg.setCreatedAt(Instant.now());
            ptg.setCreatedBy(SecurityUtils.getCurrentUser());

            lstInsert.add(ptg);
        });

        if (lstInsert.size() > 0) {
            projectTargetGroupRepository.saveAll(lstInsert);
        }
    }

    @Transactional(readOnly = true)
    public PageExt<ProjectDTO> search(Pageable pageable, ProjectSearchDTO dto) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Project> pQuery = cb.createQuery(Project.class);
        Root<Project> root = pQuery.from(Project.class);

        // build dieu kien tim kiem
        List<Predicate> predicates = new ArrayList<>();

        List<String> authorities = SecurityUtils.getAuthorities();
        if (!authorities.contains(RolesEnum.ROLE_ADMIN.name())) {
            predicates.add(cb.notEqual(
                    root.get(Project_.STATUS).as(ProjectStatusEnum.class),
                    ProjectStatusEnum.DELETE
            ));
        }

        if (dto.getUnitCode() != null) {
            predicates.add(cb.equal(root.get(Project_.UNIT),dto.getUnitCode()));
        }

        if (dto.getCode() != null) {
            predicates.add(cb.like(root.get(Project_.CODE), "%" + dto.getCode() + "%"));
        }
        if (StringUtils.isNotEmpty(dto.getName())) {
            predicates.add(cb.like(root.get(Project_.NAME), "%" + dto.getName() + "%"));
        }
        if (StringUtils.isNotEmpty(dto.getStartDate())) {
            predicates.add(cb.greaterThanOrEqualTo(
                    root.get(Project_.START_DATE).as(Instant.class),
                    DateUtils.asInstant(dto.getStartDate() + " 00:00:00")
            ));
        }
        if (StringUtils.isNotEmpty(dto.getEndDate())) {
            predicates.add(cb.lessThanOrEqualTo(
                    root.get(Project_.END_DATE).as(Instant.class),
                    DateUtils.asInstant(dto.getEndDate() + " 23:59:59")
            ));
        }

        //add sort expression
        pQuery.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(root.get(order.getProperty()), order.isAscending())));
        pQuery.orderBy(orders);

        // truy van du lieu phan trang va sap xep
        List<Project> projects = em.createQuery(pQuery)
                .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // dem tong so ban ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(Project.class)))
                .where(predicates.toArray(new Predicate[0]));
        Long total = em.createQuery(countQuery).getSingleResult();
        List<User> users = userRepository.findByIdIn(
            projects.stream().map(Project::getPmoUser).collect(Collectors.toList()));

        List<ProjectDTO> dtos = projects.stream().map(e -> {
            ProjectDTO d = projectMapper.toDto(e);
            User user = users.stream().filter(u -> u.getId().equals(d.getPmoUser())).findFirst().orElse(null);
            d.setPmoName(user == null ? null : user.getFullName());
            return d;
        }).collect(Collectors.toList());
        Long totalPages = total / pageable.getPageSize();
        return new PageExt<>(
            total,
            total % pageable.getPageSize() == 0 ? totalPages.intValue() : totalPages.intValue() + 1,
            dtos
        );
    }

    /**
     * Get one project by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public ResDTO<ProjectDTO> findById(Long id) {
        log.debug("Request to get Project : {}", id);
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return ResDTO.error(MessageEnum.PROJECT_NOT_FOUND);
        }
        ProjectDTO dto = projectMapper.toDto(project);
        userRepository.findById(project.getPmoUser()).ifPresent(user -> dto.setPmoName(user.getFullName()));
        regionRepository.findByCode(project.getArea()).ifPresent(area -> dto.setAreaName(area.getName()));
        regionRepository.findByCode(project.getProvince()).ifPresent(province -> dto.setProvinceName(province.getName()));
        regionRepository.findByCode(project.getDistrict()).ifPresent(district -> dto.setDistrictName(district.getName()));
        return ResDTO.success(dto);
    }

    @Transactional(rollbackFor = Exception.class)
    public ResDTO<Void> delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return ResDTO.error(MessageEnum.PROJECT_NOT_FOUND);
        }
        String role = SecurityUtils.getAuthorities().get(0);
        String userLogin = SecurityUtils.getCurrentUser();
        if (RolesEnum.ROLE_LEADER_SPECIAL.name().equals(role) || (RolesEnum.ROLE_LEADER.name().equals(role) && userLogin.equals(project.getCreatedBy()))) {
            project.setStatus(ProjectStatusEnum.DELETE);
            project.setUpdatedBy(userLogin);
            project.setUpdatedAt(Instant.now());
            projectRepository.save(project);
            return ResDTO.success();
        }
        return ResDTO.error(MessageEnum.NOT_PERMISSION);
    }

    @Transactional(readOnly = true)
    public List<SelectBoxDTO> getProjectSelectBox() {
        String role = SecurityUtils.getAuthorities().get(0);
        String unitCode = null;
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
            if (user == null) {
                return new ArrayList<>();
            }
            unitCode = user.getUnitCode();
        }
        return projectRepository.getProjectSelectBox(unitCode);
    }

    public List<String> findSelectedTargetGroup(String code) {
        List<ProjectTargetGroup> ptg = projectTargetGroupRepository.findByProjectCode(code);
        return ptg.stream().map(ProjectTargetGroup::getTargetGroupCode).collect(Collectors.toList());
    }

//    @Cacheable("project-user-selected")
    public List<AssigneeUserDTO> findSelectedUserByProject(String code) {
        return projectUserRepository.getUserByProject(code);
    }

//    @Cacheable("project-codes")
    public List<String> getAllCode() {
        String role = SecurityUtils.getAuthorities().get(0);
        if (RolesEnum.ROLE_LEADER.name().equals(role)) {
            User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
            if (user == null) {
                return new ArrayList<>();
            }
            return projectRepository.getProjectSelectBox(user.getUnitCode()).stream()
                .map(SelectBoxDTO::getCode).collect(Collectors.toList());
        } else {
            return projectRepository.findAll().stream()
                .map(Project::getCode).collect(Collectors.toList());
        }
    }

    @Scheduled(fixedRate = 10*60*1000)
    @CacheEvict(value = "project-codes")
    public void evictCache() {
    }

}
