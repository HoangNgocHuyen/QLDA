package com.dsd.pm.repository;

import com.dsd.pm.domain.Tasks;
import com.dsd.pm.enums.TaskStatusEnum;
import com.dsd.pm.service.dto.AssigneeUserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the Tasks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TasksRepository extends JpaRepository<Tasks, Long> {

    Optional<Tasks> findByCode(String code);

    List<Tasks> findByIdIn(List<Long> ids);

    List<Tasks> findAllByStatus(TaskStatusEnum status);

    Long countAllByTaskParentCode(String taskParentCode);

    @Query(value = "select distinct (taskParentCode) from Tasks where taskParentCode is not null")
    List<String> getAllTaskParentCode();
}
