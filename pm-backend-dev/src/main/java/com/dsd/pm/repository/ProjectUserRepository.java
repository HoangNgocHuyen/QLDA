package com.dsd.pm.repository;

import com.dsd.pm.domain.ProjectUser;
import com.dsd.pm.service.dto.AssigneeUserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {

    void deleteByProjectCodeAndUserIdIn(String projectCode, List<Long> userIds);

    List<ProjectUser> findByProjectCode(String projectCode);

    @Query(value = "select p.userId " +
        "from ProjectUser p where p.projectCode = :projectCode")
    List<Long> findUserIdByProjectCode(@Param("projectCode") String projectCode);

    @Query(value = "select new com.dsd.pm.service.dto.AssigneeUserDTO(u.id, u.login, u.fullName, u.email, u.mobile, u.unitCode) " +
        "from ProjectUser p " +
        "left join User u on p.userId = u.id " +
        "where p.projectCode = :projectCode")
    List<AssigneeUserDTO> getUserByProject(@Param("projectCode") String projectCode);

}
