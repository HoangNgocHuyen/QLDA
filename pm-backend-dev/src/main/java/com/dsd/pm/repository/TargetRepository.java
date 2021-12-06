package com.dsd.pm.repository;

import com.dsd.pm.domain.Targets;
import com.dsd.pm.enums.TargetStatusEnum;
import com.dsd.pm.service.dto.TargetSelectBoxDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@SuppressWarnings("unused")
@Repository
public interface TargetRepository extends JpaRepository<Targets, Long> {

    @Query(value = "select j from Targets j where :status is null or j.status = :status",
        countQuery = "select count(j) from Targets j where :status is null or j.status = :status"
    )
    Page<Targets> search(
        @Param("status") TargetStatusEnum status,
        Pageable pageable
    );

    @Query(value = "select new com.dsd.pm.service.dto.TargetSelectBoxDTO(j.id, j.title,  j.code, j.projectId, j.unitCode) " +
        "from Targets j where j.status <> :status")
    List<TargetSelectBoxDTO> getTargetSelectBox(@Param("status") TargetStatusEnum status);

    Optional<Targets> findByCode(String code);
}
