package com.dsd.pm.service;

import com.dsd.pm.domain.*;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.enums.RolesEnum;
import com.dsd.pm.enums.TargetStatusEnum;
import com.dsd.pm.repository.*;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.service.mapper.TargetMapper;
import com.dsd.pm.service.util.*;
import com.dsd.pm.web.rest.errors.ApiException;
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
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Targets}.
 */
@Service
@Transactional
public class TargetService {

    private final Logger log = LoggerFactory.getLogger(TargetService.class);

    private final TargetRepository targetRepository;
    private final ProjectRepository projectRepository;
    private final TargetGroupRepository targetGroupRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final EntityManager em;
    private final TargetMapper targetMapper;

    public TargetService(TargetRepository targetRepository,
                         ProjectRepository projectRepository,
                         TargetGroupRepository targetGroupRepository,
                         UnitRepository unitRepository,
                         UserRepository userRepository, EntityManager em,
                         TargetMapper targetMapper) {
        this.targetRepository = targetRepository;
        this.projectRepository = projectRepository;
        this.targetGroupRepository = targetGroupRepository;
        this.unitRepository = unitRepository;
        this.userRepository = userRepository;
        this.em = em;
        this.targetMapper = targetMapper;
    }

    /**
     * Save a target.
     *
     * @param dto the entity to save.
     * @return the persisted entity.
     */
    public TargetDTO save(TargetDTO dto) {
        log.debug("Request to save target : {}", dto);
        Project project = projectRepository.findByCode(dto.getProjectCode()).orElse(null);
        if (project == null) {
            throw new ApiException(MessageEnum.PROJECT_NOT_FOUND);
        }
        TargetGroup group = targetGroupRepository.findByCode(dto.getGroupCode()).orElse(null);
        if (group == null) {
            throw new ApiException(MessageEnum.TARGET_GROUP_NOT_FOUND);
        }
        Unit unit = unitRepository.findByUnitCode(dto.getUnitCode()).orElse(null);
        if (unit == null) {
            throw new ApiException(MessageEnum.UNIT_NOT_FOUND);
        }
        dto.setProjectId(project.getId());
        dto.setGroupId(group.getId());
        if (dto.getId() != null) {
            return this.update(dto);
        } else {
            return this.create(dto);
        }
    }

    private TargetDTO create(TargetDTO dto) {
        Targets exits = targetRepository.findByCode(dto.getCode()).orElse(null);
        if (exits != null) {
            throw new ApiException(MessageEnum.CODE_EXIST);
        }
        Targets targets = new Targets();
        BeanUtils.copyProperties(dto, targets);
        targets.setCode(dto.getCode().toUpperCase());
        targets.setCreatedAt(Instant.now());
        targets.setCreatedBy(SecurityUtils.getCurrentUserLogin().orElse(""));
        targetRepository.save(targets);
        return targetMapper.toDto(targets);
    }

    private TargetDTO update(TargetDTO dto) {
        Targets targets = targetRepository.findById(dto.getId()).orElse(null);
        if (targets == null) {
            throw new ApiException(MessageEnum.TARGET_NOT_FOUND);
        }
        if (TargetStatusEnum.CLOSED.equals(targets.getStatus()) || TargetStatusEnum.FINISHED.equals(targets.getStatus())) {
            throw new ApiException(MessageEnum.STATUS_INVALID);
        }
        targets.setTitle(dto.getTitle());
        targets.setDescription(dto.getDescription());
        targets.setStatus(dto.getStatus());
        targets.setProjectId(dto.getProjectId());
        targets.setStartTime(dto.getStartTime());
        targets.setEndTime(dto.getEndTime());
        targets.setGroupId(dto.getGroupId());
        targets.setDonePercent(dto.getDonePercent());
        targets.setNumberDay(dto.getNumberDay());
        targets.setNumberDayWorking(dto.getNumberDayWorking());
        targets.setNumberMeeting(dto.getNumberMeeting());
        targets.setUnitCode(dto.getUnitCode());
        if (TargetStatusEnum.CLOSED.equals(dto.getStatus())) {
            targets.setClosedAt(Instant.now());
            targets.setClosedBy(SecurityUtils.getCurrentUserLogin().orElse(""));
        }
        targets = targetRepository.save(targets);
        return targetMapper.toDto(targets);
    }

    /**
     * Get all the target.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TargetDTO> findAll(Pageable pageable) {
        log.debug("Request to get all targets");
        return targetRepository.findAll(pageable).map(targetMapper::toDto);
    }

    /**
     * Get one target by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public TargetDTO findOne(Long id) {
        log.debug("Request to get targets : {}", id);
        Targets targets = targetRepository.findById(id).orElse(null);
        if (targets == null) {
            return null;
        }
        TargetDTO dto = new TargetDTO();
        BeanUtils.copyProperties(targets, dto);
        Unit unit = unitRepository.findByUnitCode(targets.getUnitCode()).orElse(null);
        if (unit != null) {
            dto.setUnitName(unit.getUnitName());
            dto.setUnitCode(unit.getUnitCode());
        }
        Project project = projectRepository.findById(targets.getProjectId()).orElse(null);
        if (project != null) {
            dto.setProjectName(project.getName());
            dto.setProjectId(project.getId());
            dto.setProjectCode(project.getCode());
        }
        TargetGroup targetGroup = targetGroupRepository.findById(targets.getGroupId()).orElse(null);
        if (targetGroup != null) {
            dto.setGroupName(targetGroup.getName());
            dto.setGroupId(targetGroup.getId());
            dto.setGroupCode(targetGroup.getCode());
        }
        return dto;
    }

    /**
     * Delete the jobs by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete target : {}", id);
        Targets targets = targetRepository.findById(id).orElse(null);
        if (targets == null) {
            throw new ApiException(MessageEnum.TARGET_NOT_FOUND);
        }
        targets.setStatus(TargetStatusEnum.CLOSED);
        targetRepository.save(targets);
    }

    @Transactional(readOnly = true)
    public Page<TargetDTO> searchCriteria(Pageable pageable, TargetSearchDTO dto) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Targets> query = cb.createQuery(Targets.class);
        Root<Targets> target = query.from(Targets.class);

        List<Predicate> predicates = new ArrayList<>();
        if (dto.getStatus() != null) {
            predicates.add(cb.equal(target.get(Targets_.STATUS).as(TargetStatusEnum.class), dto.getStatus()));
        }
        if (StringUtils.isNotBlank(dto.getCode())) {
            predicates.add(cb.equal(target.get(Targets_.CODE), dto.getCode()));
        }
        if (StringUtils.isNotBlank(dto.getTitle())) {
            predicates.add(cb.like(target.get(Targets_.TITLE), "%" + dto.getTitle() + "%"));
        }
        if (dto.getStartTime() != null) {
            predicates.add(cb.greaterThanOrEqualTo(target.get(Targets_.START_TIME), dto.getStartTime()));
        }
        if (dto.getEndTime() != null) {
            predicates.add(cb.lessThanOrEqualTo(target.get(Targets_.END_TIME), dto.getEndTime()));
        }
        //add sort expression
        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(target.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        // truy van du lieu phan trang va sap xep
        List<Targets> targets = em.createQuery(query)
            .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        // dem tong so ban ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(Targets.class)))
            .where(predicates.toArray(new Predicate[0]));
        Long total = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(
            targets.stream().map(targetMapper::toDto).collect(Collectors.toList()),
            pageable,
            total);
    }

    @SuppressWarnings("unchecked")
    public PageExt<TargetSearchResultDTO> searchSql(Pageable pageable, TargetSearchDTO dto) {
        String strQuery = FileUtils.getSqlCommand(FileUtils.TARGET_SEARCH);
        if (strQuery == null) {
            throw new NullPointerException("Target search sql is null");
        }
        strQuery = strQuery.replace("###order_by###", CommonUtil.buildOrder(pageable, "j"));

        Query q = em.createNativeQuery(strQuery, "TargetSearchResultDTO");
        q.setParameter("status", dto.getStatus() == null ? null : dto.getStatus().name());
        q.setParameter("code", StringUtils.isEmpty(dto.getCode()) ? null : dto.getCode().toLowerCase());
        q.setParameter("title", StringUtils.isEmpty(dto.getTitle()) ? null : dto.getTitle().toLowerCase());
        q.setParameter("projectCode", StringUtils.isEmpty(dto.getProjectCode()) ? null : dto.getProjectCode());
        q.setParameter("groupCode", StringUtils.isEmpty(dto.getGroupCode()) ? null : dto.getGroupCode());
        q.setParameter("unitCode", StringUtils.isEmpty(dto.getUnitCode()) ? null : dto.getUnitCode().toLowerCase());
        if (dto.getStartTime() != null) {
            q.setParameter("startTime", DateUtils.asString(dto.getStartTime()));
        } else {
            q.setParameter("startTime", null);
        }
        if (dto.getEndTime() != null) {
            q.setParameter("endTime", DateUtils.asString(dto.getEndTime()));
        } else {
            q.setParameter("endTime", null);
        }
        q.setParameter("limit", pageable.getPageSize());
        q.setParameter("offset", pageable.getPageNumber() * pageable.getPageSize());

        List<TargetSearchResultDTO> result = (List<TargetSearchResultDTO>) q.getResultList();
        long totalElements = result.size() == 0 ? 0 : result.get(0).getTotalRecord();
        Long totalPages = totalElements / pageable.getPageSize();
        return new PageExt<>(
            totalElements,
            totalElements % pageable.getPageSize() == 0 ? totalPages.intValue() : totalPages.intValue() + 1,
            result
        );
    }

    @Transactional(readOnly = true)
    public List<TargetSelectBoxDTO> getTargetSelectBox() {
        return targetRepository.getTargetSelectBox(TargetStatusEnum.CLOSED);
    }

    public TargetImport validateFileImport(TargetImport fileImport) {
        try {
            List<List<String>> xlsData = ExcelUtils.extractFile(fileImport.getFile().getInputStream());
            int rowIdx = 0;
            fileImport.setData(new ArrayList<TargetDTO>());
            List<String> lstCode = new ArrayList<>();
            String role = SecurityUtils.getAuthorities().get(0);
            User userLogin = userRepository.findOneByLogin(SecurityUtils.getCurrentUser()).orElse(null);
            if (userLogin == null) {
                throw new ApiException(MessageEnum.USERS_NOT_FOUND);
            }
            for (List<String> row : xlsData) {
                rowIdx++;
                TargetDTO dto = new TargetDTO();
                dto.setCode(ExcelUtils.getRowValue(row, 0));
                dto.setTitle(ExcelUtils.getRowValue(row, 1));
                dto.setProjectCode(ExcelUtils.getRowValue(row, 2));
                dto.setGroupCode(ExcelUtils.getRowValue(row, 3));
                dto.setUnitCode(ExcelUtils.getRowValue(row, 4));
                try {
                    dto.setStartTime(DateUtils.asInstant(ExcelUtils.getRowValue(row, 5) + " 00:00:00"));
                } catch (Exception e) {
                    dto.setErrors("startTime", "Start time invalid");
                    fileImport.setValid(false);
                }
                try {
                    dto.setEndTime(DateUtils.asInstant(ExcelUtils.getRowValue(row, 6) + " 23:59:59"));
                } catch (Exception e) {
                    fileImport.setValid(false);
                    dto.setErrors("endTime", "End time invalid");
                }
                dto.setDonePercent(Integer.parseInt(ExcelUtils.getRowValue(row, 7)));
                dto.setNumberDay(Integer.parseInt(ExcelUtils.getRowValue(row, 8)));
                dto.setNumberDayWorking(Integer.parseInt(ExcelUtils.getRowValue(row, 9)));
                dto.setNumberMeeting(Integer.parseInt(ExcelUtils.getRowValue(row, 10)));
                dto.setDescription(ExcelUtils.getRowValue(row, 11));
                if (StringUtils.isBlank(dto.getCode())) {
                    dto.setErrors("code", "Require Code");
                    fileImport.setValid(false);
                } else {
                    if (!dto.getCode().matches("^[a-zA-Z0-9_]{3,20}+")) {
                        dto.setErrors("code", "Code invalid");
                        fileImport.setValid(false);
                    } else {
                        if (lstCode.contains(dto.getCode())) {
                            dto.setErrors("code", "Code Exist in File");
                            fileImport.setValid(false);
                        } else {
                            lstCode.add(dto.getCode());
                            Targets target = targetRepository.findByCode(dto.getCode()).orElse(null);
                            if (target != null) {
                                dto.setErrors("code", "Code Exist in DB");
                                fileImport.setValid(false);
                            }
                        }
                    }
                }
                if (StringUtils.isBlank(dto.getTitle())) {
                    dto.setErrors("title", "Require title");
                    fileImport.setValid(false);
                }
                if (StringUtils.isBlank(dto.getProjectCode())) {
                    dto.setErrors("projectCode", "Require project");
                    fileImport.setValid(false);
                } else {
                    Project project = projectRepository.findByCode(dto.getProjectCode()).orElse(null);
                    if (project == null) {
                        dto.setErrors("projectCode", "Project not found");
                        fileImport.setValid(false);
                    } else {
                        // check permission
                        if (RolesEnum.ROLE_LEADER_SPECIAL.name().equals(role) || (!RolesEnum.ROLE_LEADER.name().equals(role) && userLogin.getId() == project.getPmoUser())) {
                        } else {
                            dto.setErrors("projectCode", "User login not permission");
                            fileImport.setValid(false);
                        }
                        dto.setProjectId(project.getId());
                    }
                }
                if (StringUtils.isBlank(dto.getGroupCode())) {
                    dto.setErrors("groupCode", "Require target group");
                    fileImport.setValid(false);
                } else {
                    TargetGroup group = targetGroupRepository.findByCode(dto.getGroupCode()).orElse(null);
                    if (group == null) {
                        dto.setErrors("groupCode", "Target Group not found");
                        fileImport.setValid(false);
                    } else {
                        dto.setGroupId(group.getId());
                    }
                }
                if (StringUtils.isBlank(dto.getUnitCode())) {
                    dto.setErrors("unitCode", "Require unit");
                    fileImport.setValid(false);
                } else {
                    Unit unit = unitRepository.findByUnitCode(dto.getUnitCode()).orElse(null);
                    if (unit == null) {
                        dto.setErrors("unitCode", "Unit not found");
                        fileImport.setValid(false);
                    }
                }
                if (dto.getNumberDay() == null) {
                    dto.setErrors("numberDay", "Required number day");
                    fileImport.setValid(false);
                }
                if (dto.getNumberDayWorking() == null) {
                    dto.setErrors("numberDayWorking", "Required number day Working");
                    fileImport.setValid(false);
                }
                if (dto.getDonePercent() == null) {
                    dto.setErrors("donePercent", "Required done percent");
                    fileImport.setValid(false);
                }
                if (dto.getNumberMeeting() == null) {
                    dto.setErrors("numberMeeting", "Required number meeting");
                    fileImport.setValid(false);
                }
                fileImport.getData().add(dto);
            }
            log.info("Dat import: " +JSONFactory.toString(fileImport.getData()));
            return fileImport;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException(MessageEnum.UNHANDLED_ERROR);
        }
    }

    public List<TargetDTO> saveListTarget(List<TargetDTO> req) {
        List<TargetDTO> res = new ArrayList<>();
        req.forEach(t -> {
            t.setStatus(TargetStatusEnum.NEW);
            TargetDTO dto = this.create(t);
            if (dto != null) {
                res.add(t);
            }
        });
        return res;
    }
}
