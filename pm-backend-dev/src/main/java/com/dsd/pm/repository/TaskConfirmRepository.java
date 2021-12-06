package com.dsd.pm.repository;

import com.dsd.pm.domain.TaskConfirm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Tasks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskConfirmRepository extends JpaRepository<TaskConfirm, Long> {

    void deleteAllByTaskId(Long taskId);

    List<TaskConfirm> findByTaskId(Long taskId);

    @Query(value = "select distinct (taskId) from TaskConfirm ")
    List<Long> getListTaskId();
}
