package com.dsd.pm.repository;

import com.dsd.pm.domain.TargetGroup;
import com.dsd.pm.enums.TargetGroupStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the TargetGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TargetGroupRepository extends JpaRepository<TargetGroup, Long> {

    Optional<TargetGroup> findByCode(String code);

    void deleteByIdIn(List<Long> ids);

    List<TargetGroup> findByStatusNot(TargetGroupStatusEnum status);

}
