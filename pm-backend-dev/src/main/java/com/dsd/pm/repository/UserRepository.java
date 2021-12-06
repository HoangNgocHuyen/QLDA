package com.dsd.pm.repository;

import com.dsd.pm.domain.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.dsd.pm.service.dto.AssigneeUserDTO;
import com.dsd.pm.service.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    List<User> findByIdIn(List<Long> ids);

    List<User> findByLoginIn(List<String> logins);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    List<User> findAllByIdNotNullAndActivatedIsTrue();

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    Optional<User> findById(Long id);

    @Query(value = "select u.id from User u where u.position = 'EMPLOYEE' and u.unitCode = :unit ")
    List<Long> getUserIdEmployeeByUnit(@Param(value = "unit") String unit);

    @Query(value = "select new com.dsd.pm.service.dto.UserDTO(u) from User u where u.activated = true and u.unitCode = :unit ")
    List<UserDTO> getUserByUnit(@Param(value = "unit") String unit);

    @Query(value = "select new com.dsd.pm.service.dto.UserDTO(u) from User u where u.login in (:logins) ")
    List<UserDTO> getUserByLoginIn(@Param(value = "logins") List<String> logins);
}
