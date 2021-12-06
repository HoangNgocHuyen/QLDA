package com.dsd.pm.repository;

import com.dsd.pm.domain.ProjectTargetGroup;
import com.dsd.pm.service.dto.ProTargetGroupDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectTargetGroupRepository extends JpaRepository<ProjectTargetGroup, Long> {

    List<ProjectTargetGroup> deleteByProjectCodeAndTargetGroupCodeIn(String projectCode, List<String> targetGroupCode);

    List<ProjectTargetGroup> findByProjectCode(String projectCode);

    @Query(value = "select new com.dsd.pm.service.dto.ProTargetGroupDTO(p.code, p.name, p.id, g.code, g.name, g.id) " +
            "from ProjectTargetGroup pg " +
            "left join Project p on pg.projectCode = p.code " +
            "left join TargetGroup g on pg.targetGroupCode = g.code " +
            "where pg.projectCode = :projectCode")
    List<ProTargetGroupDTO> getTargetGroupByProject(@Param("projectCode") String projectCode);

}
