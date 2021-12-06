package com.dsd.pm.repository;

import com.dsd.pm.domain.Unit;
import com.dsd.pm.domain.User;
import com.dsd.pm.enums.UnitStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

    Optional<Unit> findByUnitCode(String unitCode);

    List<Unit> findByUnitCodeIn(List<String> unitCode);
}
