package com.dsd.pm.service;

import com.dsd.pm.domain.TaskConfirm;
import com.dsd.pm.domain.TaskUser;
import com.dsd.pm.domain.Tasks;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.enums.TaskStatusEnum;
import com.dsd.pm.repository.TaskConfirmRepository;
import com.dsd.pm.repository.TaskUserRepository;
import com.dsd.pm.repository.TasksRepository;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.service.util.DateUtils;
import com.dsd.pm.service.util.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by sonba@itsol.vn
 * Date: 29/05/2021
 * Time: 8:37 PM
 */
@Service
@Transactional
public class TasksService {

    private final TasksRepository tasksRepository;
    private final TaskUserRepository taskUserRepository;
    private final EntityManager em;
    private final TaskConfirmRepository taskConfirmRepository;

    public TasksService(TasksRepository tasksRepository,
                        TaskUserRepository taskUserRepository,
                        EntityManager em,
                        TaskConfirmRepository taskConfirmRepository) {
        this.tasksRepository = tasksRepository;
        this.taskUserRepository = taskUserRepository;
        this.em = em;
        this.taskConfirmRepository = taskConfirmRepository;
    }

    public ResDTO<Long> createdTasks(TasksDTO tasksDTO) {
        Optional<Tasks> item = tasksRepository.findByCode(tasksDTO.getCode());
        if (item.isPresent()) {
            return ResDTO.error(MessageEnum.ALREADY_EXITS.format("Mã công việc đã tồn tại"));
        }
        Tasks tasks = tasksDTO.toEntity(null);
        tasks = tasksRepository.save(tasks);

        // Save User Tasks
        List<TaskUser> taskUsers = tasksDTO.toTaskUsersEntity(tasks.getId());
        if (taskUsers != null && !taskUsers.isEmpty()) {
            taskUserRepository.saveAll(taskUsers);
        }

        List<TaskConfirm> taskConfirms = tasksDTO.toTaskConfirmEntity(tasks.getId());
        if (taskConfirms != null && !taskConfirms.isEmpty()) {
            taskConfirmRepository.saveAll(taskConfirms);
        }
        return ResDTO.success(tasks.getId());
    }

    public ResDTO<Long> updateTasks(TasksDTO tasksDTO) {
        Optional<Tasks> item = tasksRepository.findByCode(tasksDTO.getCode());
        if (!item.isPresent()) {
            return ResDTO.error(MessageEnum.NOT_FOUND.format("Công việc không tồn tại"));
        }
        Tasks tasks = tasksDTO.toEntity(item.get().getId());
        tasks = tasksRepository.save(tasks);

        //Save User Tasks
        taskUserRepository.deleteAllByTaskId(tasks.getId());
        List<TaskUser> taskUsers = tasksDTO.toTaskUsersEntity(tasks.getId());
        if (taskUsers != null && !taskUsers.isEmpty()) {
            taskUserRepository.saveAll(taskUsers);
        }

        List<TaskConfirm> taskConfirms = tasksDTO.toTaskConfirmEntity(tasks.getId());
        if (taskConfirms != null && !taskConfirms.isEmpty()) {
            taskConfirmRepository.saveAll(taskConfirms);
        }
        return ResDTO.success(tasks.getId());
    }

    @SuppressWarnings("unchecked")
    public PageExt<TaskSearchResDTO> search(Pageable pageable, TaskSearchDTO dto) {
        String strQuery = FileUtils.getSqlCommand(FileUtils.TASK_SEARCH);
        if (strQuery == null) {
            throw new NullPointerException("task search sql is null");
        }

        Query q = em.createNativeQuery(strQuery, "TaskSearchResDTO");
        q.setParameter("projectCode", StringUtils.isEmpty(dto.getProjectCode()) ? null : dto.getProjectCode().trim());
        q.setParameter("targetCode", StringUtils.isEmpty(dto.getTargetCode()) ? null : dto.getTargetCode().trim());
        q.setParameter("code", StringUtils.isEmpty(dto.getCode()) ? null : dto.getCode().trim());
        q.setParameter("name", StringUtils.isEmpty(dto.getName()) ? null : dto.getName().trim());
        q.setParameter("parentCode", StringUtils.isEmpty(dto.getParentCode()) ? null : dto.getParentCode().trim());
        q.setParameter("type", dto.getType() == null ? null : dto.getType().getType());
        q.setParameter("userId", dto.getUserId());
        q.setParameter("userIds", dto.getUserIds());
        q.setParameter("limit", pageable.getPageSize());
        q.setParameter("offset", pageable.getPageNumber() * pageable.getPageSize());
        if (dto.getStartDate() != null) {
            q.setParameter("startDate", DateUtils.asString(dto.getStartDate()));
        } else {
            q.setParameter("startDate", null);
        }
        if (dto.getEndDate() != null) {
            q.setParameter("endDate", DateUtils.asString(dto.getEndDate()));
        } else {
            q.setParameter("endDate", null);
        }

        List<TaskSearchResDTO> result = (List<TaskSearchResDTO>) q.getResultList();
        long totalElements = result.size() == 0 ? 0 : result.get(0).getTotalRecord();
        Long totalPages = totalElements / pageable.getPageSize();

        return new PageExt<>(
            totalElements,
            totalElements % pageable.getPageSize() == 0 ? totalPages.intValue() : totalPages.intValue() + 1,
            result
        );
    }

    @Transactional(readOnly = true)
    public TasksDTO findOne(Long id) {
        Tasks task = tasksRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        TasksDTO dto = new TasksDTO(task);
        dto.setDetail(tasksRepository.countAllByTaskParentCode(task.getCode()) == 0);
        dto.setTaskUsers(taskUserRepository.getTaskUserByTaskId(task.getId()));
        dto.setTaskConfirms(taskConfirmRepository.findByTaskId(task.getId()).stream().map(TaskConfirmDTO::new).collect(Collectors.toList()));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<TasksDTO> findAllTask() {
        List<Tasks> tasks = tasksRepository.findAllByStatus(TaskStatusEnum.OPEN);
        if (tasks.isEmpty()) {
            return null;
        }
        return tasks.stream().map(TasksDTO::new).collect(Collectors.toList());
    }
}
