package com.dsd.pm.repository;

import com.dsd.pm.domain.TaskUser;
import com.dsd.pm.service.dto.TaskUserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Tasks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {

    List<TaskUser> findByUserId(Long userId);

    @Query(value = "select tu.userId from TaskUser tu where tu.taskId = :taskId ")
    List<Long> findUerIdByTaskId(@Param("taskId") Long taskId);

    @Query(value = "select new com.dsd.pm.service.dto.TaskUserDTO(g.id, g.userId, u.login, u.fullName, g.taskId) from TaskUser g left join User u on u.id = g.userId " +
        "where g.taskId = :taskId")
    List<TaskUserDTO> getTaskUserByTaskId(@Param("taskId") Long taskId);

    void deleteAllByTaskId(Long taskId);
}
