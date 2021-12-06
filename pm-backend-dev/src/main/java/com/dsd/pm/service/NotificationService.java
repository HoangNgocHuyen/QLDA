package com.dsd.pm.service;

import com.dsd.pm.domain.*;
import com.dsd.pm.enums.*;
import com.dsd.pm.repository.*;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.service.util.JSONFactory;
import com.dsd.pm.web.rest.errors.ApiException;
import com.dsd.pm.ws.SendMessageAPI;
import com.google.common.base.Strings;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationUserRepository notificationUserRepository;
    private final TasksRepository tasksRepository;
    private final ProjectRepository projectRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final TaskUserRepository taskUserRepository;
    private final SendMessageAPI sendMessageAPI;
    private final EntityManager em;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationUserRepository notificationUserRepository, TasksRepository tasksRepository, ProjectRepository projectRepository,
                               UnitRepository unitRepository, UserRepository userRepository,
                               TaskUserRepository taskUserRepository, SendMessageAPI sendMessageAPI, EntityManager em) {
        this.notificationRepository = notificationRepository;
        this.notificationUserRepository = notificationUserRepository;
        this.tasksRepository = tasksRepository;
        this.projectRepository = projectRepository;
        this.unitRepository = unitRepository;
        this.userRepository = userRepository;
        this.taskUserRepository = taskUserRepository;
        this.sendMessageAPI = sendMessageAPI;
        this.em = em;
    }

    public NotificationDTO create(NotificationDTO dto) {
        if (dto.getType() == null ||  StringUtils.isBlank(dto.getTitle()) || StringUtils.isBlank(dto.getMessage())) {
            throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
        }
        Notification entity = this.validate(dto, new Notification());
        if (dto.getUsers() == null || dto.getUsers().isEmpty()) {
            throw new ApiException(MessageEnum.USERS_NOT_FOUND);
        }
        entity.setTitle(dto.getTitle());
        entity.setMessage(dto.getMessage());
        entity.setType(dto.getType());
        entity.setStatus(NotifyStatusEnum.PENDING);
        Notification notc = notificationRepository.save(entity);
        List<NotificationUser> notcUsers = new ArrayList<>();
        dto.getUsers().forEach(u -> {
            NotificationUser notcU = new NotificationUser();
            notcU.setUsername(u.getLogin());
            notcU.setNotificationId(notc.getId());
            notcU.setUserId(u.getId());
            notcU.setStatus(NotifyStatusEnum.PENDING);
            notcUsers.add(notcU);
        });
        if (notcUsers.size() > 0) {
            notificationUserRepository.saveAll(notcUsers);
        }
        this.sendNotification(notc);
        return dto;
    }

    private Notification validate(NotificationDTO dto, Notification entity) {
        List<UserDTO> users = new ArrayList<>();
        switch (dto.getType()) {
            case TASK:
                if (StringUtils.isBlank(dto.getTaskCode())) {
                    throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
                } else {
                    Tasks tasks = tasksRepository.findByCode(dto.getTaskCode()).orElse(null);
                    if (tasks == null) {
                        throw new ApiException(MessageEnum.TASK_NOT_FOUND);
                    }
                    List<TaskUserDTO> taskUsers = taskUserRepository.getTaskUserByTaskId(tasks.getId());
                    List<UserDTO> finalUsers = new ArrayList<>();
                    taskUsers.forEach(tu -> {
                        UserDTO u = new UserDTO();
                        u.setId(tu.getId());
                        u.setLogin(tu.getUsername());
                        finalUsers.add(u);
                    });
                    users = finalUsers;
                    entity.setTaskCode(dto.getTaskCode());
                }
                break;
            case UNIT:
                if (StringUtils.isBlank(dto.getUnitCode())) {
                    throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
                } else {
                    Unit unit = unitRepository.findByUnitCode(dto.getUnitCode()).orElse(null);
                    if (unit == null) {
                        throw new ApiException(MessageEnum.UNIT_NOT_FOUND);
                    }
                    users = userRepository.getUserByUnit(dto.getUnitCode());
                    entity.setUnitCode(dto.getUnitCode());
                }
                break;
            case USER:
                if (StringUtils.isBlank(dto.getUsername())) {
                    throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
                } else {
                    User user = userRepository.findOneByLogin(dto.getUsername()).orElse(null);
                    if (user == null) {
                        throw new ApiException(MessageEnum.USERS_NOT_FOUND);
                    }
                    UserDTO u = new UserDTO();
                    u.setId(user.getId());
                    u.setLogin(user.getLogin());
                    users.add(u);
                    entity.setUsername(dto.getUsername());
                }
                break;
            case PROJECT:
                if (StringUtils.isBlank(dto.getProjectCode())) {
                    throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
                } else {
                    Project project = projectRepository.findByCode(dto.getProjectCode()).orElse(null);
                    if (project == null) {
                        throw new ApiException(MessageEnum.UNIT_NOT_FOUND);
                    }
                }
                entity.setProjectCode(dto.getProjectCode());
                break;
            case LIST_USER:
                if (StringUtils.isBlank(dto.getListUsername())) {
                    throw new ApiException(MessageEnum.ARGUMENT_NOT_VALID);
                }
                List<String> usernames = new ArrayList<>();
                try {
                    usernames = Arrays.asList(dto.getListUsername().split(";"));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                List<UserDTO> lstUser = userRepository.getUserByLoginIn(usernames);
                if (lstUser.isEmpty()) {
                    throw new ApiException(MessageEnum.USERS_NOT_FOUND);
                }
                List<String> loginsDb = lstUser.stream().map(UserDTO::getLogin).collect(Collectors.toList());
                usernames.forEach(u -> {
                    if (!loginsDb.contains(u)) {
                        throw new ApiException(MessageEnum.USERS_NOT_FOUND);
                    }
                });
                users = lstUser;
                entity.setListUsername(dto.getListUsername());
                break;
        }
        dto.setUsers(users);
        return entity;
    }

    public ResDTO<Void> update(NotificationDTO dto) {
        return ResDTO.success();
    }

    public ResDTO<Void> updateStatusWatched(NotificationStatusDTO dto) {
        try {
            List<Long> notcUserIds = notificationUserRepository.getIdNotiSentByUser(dto.getUsername(), dto.getNotificationIds(), NotifyStatusEnum.SENT);
            if (notcUserIds == null || notcUserIds.isEmpty()) {
                return ResDTO.error(MessageEnum.NOT_FOUND);
            }
            notificationUserRepository.updateStatus(notcUserIds, NotifyStatusEnum.WATCHED);
            return ResDTO.success();
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResDTO.error(MessageEnum.UNHANDLED_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public NotificationDTO findOne(Long id) {
        log.debug("Request to get targets : {}", id);
        Notification notify = notificationRepository.findById(id).orElse(null);
        if (notify == null) {
            return null;
        }
        NotificationDTO dto = new NotificationDTO();
        BeanUtils.copyProperties(notify, dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<NotificationDTO> searchCriteria(Pageable pageable, NotificationSearchDTO dto) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Notification> query = cb.createQuery(Notification.class);
        Root<Notification> notc = query.from(Notification.class);

        List<Predicate> predicates = new ArrayList<>();
        if (dto.getStatus() != null) {
            predicates.add(cb.equal(notc.get(Notification_.STATUS).as(NotifyStatusEnum.class), dto.getStatus()));
        }
        if (dto.getType() != null) {
            predicates.add(cb.equal(notc.get(Notification_.TYPE).as(NotifyTypeEnum.class), dto.getType()));
        }
        if (dto.getStartTime() != null) {
            predicates.add(cb.greaterThanOrEqualTo(notc.get(Notification_.CREATED_DATE), dto.getStartTime()));
        }
        if (dto.getEndTime() != null) {
            predicates.add(cb.lessThanOrEqualTo(notc.get(Notification_.CREATED_DATE), dto.getEndTime()));
        }
        //add sort expression
        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(notc.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        // truy van du lieu phan trang va sap xep
        List<Notification> notifications = em.createQuery(query)
            .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        // dem tong so ban ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(Notification.class)))
            .where(predicates.toArray(new Predicate[0]));
        Long total = em.createQuery(countQuery).getSingleResult();
        List<NotificationDTO> data = new ArrayList<>();
        notifications.forEach(notify -> {
            NotificationDTO n = new NotificationDTO();
            BeanUtils.copyProperties(notify, n);
            data.add(n);
        });
        return new PageImpl<>(
            data,
            pageable,
            total)
        ;
    }

    public List<NotificationDTO> getNotifyByUser(String login, Pageable pageable) {
        List<NotifyStatusEnum> status = new ArrayList<>();
        status.add(NotifyStatusEnum.SENT);
        status.add(NotifyStatusEnum.WATCHED);
        if (pageable == null) {
            pageable = PageRequest.of(0, 10, Sort.by("createdDate").descending());
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdDate").descending());
        }
        List<NotificationDTO> notcs = notificationUserRepository.getNotifyIdByUser(login, status, pageable);
        if (notcs == null || notcs.isEmpty()) {
            return new ArrayList<>();
        }
        return notcs;
    }

    private void sendNotification(Notification notc) {
        if (notc == null || notc.getId() == null || !NotifyStatusEnum.PENDING.equals(notc.getStatus())) {
            log.error("PUSH NOTI NULL: {}", JSONFactory.toString(notc));
            return;
        }
        try {
            List<NotificationUser> notcUsers = notificationUserRepository.findByNotificationIdAndStatus(notc.getId(), NotifyStatusEnum.PENDING);
            notcUsers.forEach(nu -> {
                long countSent = notificationUserRepository.countNotcSentByUser(nu.getUsername(), NotifyStatusEnum.SENT);
                SendNotifyDTO sendDto = new SendNotifyDTO();
                sendDto.setId(notc.getId());
                sendDto.setTitle(notc.getTitle());
                sendDto.setMessage(notc.getMessage());
                sendDto.setType(notc.getType());
                sendDto.setCountSent(countSent);
                sendMessageAPI.sendMessageForUser(nu.getUsername(), sendDto);
                nu.setStatus(NotifyStatusEnum.SENT);
                notificationUserRepository.save(nu);
            });
            notc.setStatus(NotifyStatusEnum.SENT);
            notificationRepository.save(notc);
        } catch (Exception e) {
            log.error("PUSH NOTI USER ERR: {}", notc.getId());
            e.printStackTrace();
        }
    }

}
