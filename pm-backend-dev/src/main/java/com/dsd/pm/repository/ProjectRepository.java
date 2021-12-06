package com.dsd.pm.repository;

import com.dsd.pm.domain.Project;
import com.dsd.pm.service.dto.SelectBoxDTO;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the Project entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query(value = "select new com.dsd.pm.service.dto.SelectBoxDTO(p.id, p.name, p.code) from Project p" +
        " where :unit is null or p.unit = :unit ")
    List<SelectBoxDTO> getProjectSelectBox(@Param("unit") String unit);

    Optional<Project> findByCode(String code);

}
