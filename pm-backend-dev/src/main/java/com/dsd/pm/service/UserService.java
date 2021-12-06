package com.dsd.pm.service;

import com.dsd.pm.config.Constants;
import com.dsd.pm.domain.Authority;
import com.dsd.pm.domain.User;
import com.dsd.pm.domain.User_;
import com.dsd.pm.enums.DataConfigEnum;
import com.dsd.pm.enums.PositionEnum;
import com.dsd.pm.enums.RolesEnum;
import com.dsd.pm.repository.AuthorityRepository;
import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.AuthoritiesConstants;
import com.dsd.pm.security.SecurityUtils;
import com.dsd.pm.service.dto.AdminUserDTO;
import com.dsd.pm.service.dto.AssigneeUserDTO;
import com.dsd.pm.service.dto.UserDTO;
import com.dsd.pm.service.dto.UserSearchReq;
import org.hibernate.query.criteria.internal.OrderImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityRepository authorityRepository;
    private final EntityManager entityManager;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthorityRepository authorityRepository,
                       EntityManager entityManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.entityManager = entityManager;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository
                .findOneByActivationKey(key)
                .map(
                        user -> {
                            // activate given user for the registration key.
                            user.setActivated(true);
                            user.setActivationKey(null);
                            log.debug("Activated user: {}", user);
                            return user;
                        }
                );
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository
                .findOneByResetKey(key)
                .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
                .map(
                        user -> {
                            user.setPassword(passwordEncoder.encode(newPassword));
                            user.setResetKey(null);
                            user.setResetDate(null);
                            return user;
                        }
                );
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
                .findOneByEmailIgnoreCase(mail)
                .filter(User::isActivated)
                .map(
                        user -> {
                            user.setResetKey(RandomUtil.generateResetKey());
                            user.setResetDate(Instant.now());
                            return user;
                        }
                );
    }

    public User registerUser(AdminUserDTO userDTO, String password) {
        userRepository
                .findOneByLogin(userDTO.getLogin().toLowerCase())
                .ifPresent(
                        existingUser -> {
                            boolean removed = removeNonActivatedUser(existingUser);
                            if (!removed) {
                                throw new UsernameAlreadyUsedException();
                            }
                        }
                );
        userRepository
                .findOneByEmailIgnoreCase(userDTO.getEmail())
                .ifPresent(
                        existingUser -> {
                            boolean removed = removeNonActivatedUser(existingUser);
                            if (!removed) {
                                throw new EmailAlreadyUsedException();
                            }
                        }
                );
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFullName(userDTO.getFullName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFullName(userDTO.getFullName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(user.getLogin());
        user.setPassword(encryptedPassword);
        /*user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());*/
        user.setActivated(true);
        user.setMobile(userDTO.getMobile());
        user.setPosition(userDTO.getPosition());
        user.setUnitCode(userDTO.getUnitCode());
        if (userDTO.getAuthorities() != null) {
            userDTO.getAuthorities().forEach(s -> {
                if (!authorityRepository.findById(s).isPresent()) {
                    authorityRepository.save(new Authority(s));
                }
            });
            Set<Authority> authorities = userDTO
                    .getAuthorities()
                    .stream()
                    .map(authorityRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional
                .of(userRepository.findById(userDTO.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(
                        user -> {
                            user.setLogin(userDTO.getLogin().toLowerCase());
                            user.setFullName(userDTO.getFullName());
                            if (userDTO.getEmail() != null) {
                                user.setEmail(userDTO.getEmail().toLowerCase());
                            }
                            user.setImageUrl(userDTO.getImageUrl());
                            user.setActivated(userDTO.isActivated());
                            user.setLangKey(userDTO.getLangKey());
                            user.setMobile(userDTO.getMobile());
                            user.setPosition(userDTO.getPosition());
                            user.setUnitCode(userDTO.getUnitCode());
                            Set<Authority> managedAuthorities = user.getAuthorities();
                            managedAuthorities.clear();
                            userDTO.getAuthorities().forEach(s -> {
                                if (!authorityRepository.findById(s).isPresent()) {
                                    authorityRepository.save(new Authority(s));
                                }
                            });
                            userDTO
                                    .getAuthorities()
                                    .stream()
                                    .map(authorityRepository::findById)
                                    .filter(Optional::isPresent)
                                    .map(Optional::get)
                                    .forEach(managedAuthorities::add);
                            log.debug("Changed Information for User: {}", user);
                            return user;
                        }
                )
                .map(AdminUserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository
                .findOneByLogin(login)
                .ifPresent(
                        user -> {
                            userRepository.delete(user);
                            log.debug("Deleted User: {}", user);
                        }
                );
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param email    email id of user.
     * @param langKey  language key.
     * @param imageUrl image URL of user.
     */
    public void updateUser(String fullName, String email, String langKey, String imageUrl) {
        SecurityUtils
                .getCurrentUserLogin()
                .flatMap(userRepository::findOneByLogin)
                .ifPresent(
                        user -> {
                            user.setFullName(fullName);
                            if (email != null) {
                                user.setEmail(email.toLowerCase());
                            }
                            user.setLangKey(langKey);
                            user.setImageUrl(imageUrl);
                            log.debug("Changed Information for User: {}", user);
                        }
                );
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils
                .getCurrentUserLogin()
                .flatMap(userRepository::findOneByLogin)
                .ifPresent(
                        user -> {
                            String currentEncryptedPassword = user.getPassword();
                            if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                                throw new InvalidPasswordException();
                            }
                            String encryptedPassword = passwordEncoder.encode(newPassword);
                            user.setPassword(encryptedPassword);
                            log.debug("Changed password for User: {}", user);
                        }
                );
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
//    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
                .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
                .forEach(
                        user -> {
                            log.debug("Deleting not activated user {}", user.getLogin());
                            userRepository.delete(user);
                        }
                );
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> searchCriteria(Pageable pageable, UserSearchReq dto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> users = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();
        if (dto.getActivated() != null) {
            predicates.add(cb.equal(users.get(User_.ACTIVATED).as(Boolean.class), dto.getActivated()));
        }
        if (dto.getLogin() != null) {
            predicates.add(cb.equal(cb.lower(users.get(User_.LOGIN)), dto.getLogin().toLowerCase()));
        }
        if (dto.getFullName() != null) {
            predicates.add(cb.like(cb.lower(users.get(User_.FULL_NAME)), "%" + dto.getFullName().toLowerCase() + "%"));
        }
        if (dto.getEmail() != null) {
            predicates.add(cb.like(cb.lower(users.get(User_.EMAIL)), "%" + dto.getEmail().toLowerCase() + "%"));
        }
        if (dto.getMobile() != null) {
            predicates.add(cb.equal(users.get(User_.MOBILE), dto.getMobile()));
        }
        if (dto.getPosition() != null) {
            predicates.add(cb.equal(users.get(User_.POSITION).as(PositionEnum.class), dto.getPosition()));
        }
        if (dto.getUnitCode() != null) {
            predicates.add(cb.equal(users.get(User_.UNIT_CODE), dto.getUnitCode()));
        }
        query.where(predicates.toArray(new Predicate[0]));
        List<Order> orders = new ArrayList<>();
        pageable.getSort().forEach(order -> orders.add(new OrderImpl(users.get(order.getProperty()), order.isAscending())));
        query.orderBy(orders);

        List<User> jobs = entityManager.createQuery(query)
                .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // select count(*) from jobs
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(User.class)))
                .where(predicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(
                jobs.stream().map(AdminUserDTO::new).collect(Collectors.toList()),
                pageable,
                total);
    }

    @Transactional(readOnly = true)
    public List<AssigneeUserDTO> getUserViewForm() {
        List<User> data = userRepository.findAllByIdNotNullAndActivatedIsTrue();
        List<AssigneeUserDTO> res = new ArrayList<>();
        data.forEach(u -> {
            AssigneeUserDTO dto = new AssigneeUserDTO();
            dto.setEmail(u.getEmail());
            dto.setLogin(u.getLogin());
            dto.setMobile(u.getMobile());
            dto.setFullName(u.getFullName());
            dto.setId(u.getId());
            dto.setUnitCode(u.getUnitCode());
            dto.setAuthorities(u.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet()));
            res.add(dto);
        });
        return res;
    }

    @PostConstruct
    public void createdUserAdminDefaultData() {
        if (!userRepository.findOneByLogin(DataConfigEnum.USER_ADMIN.getCode()).isPresent()) {
            AdminUserDTO adminUserDTO = new AdminUserDTO();
            adminUserDTO.setLogin(DataConfigEnum.USER_ADMIN.getCode());
            adminUserDTO.setFullName(DataConfigEnum.USER_ADMIN.getName());
            adminUserDTO.setPosition(PositionEnum.ADMIN);
            adminUserDTO.setAuthorities(Collections.singleton(RolesEnum.ROLE_ADMIN.getRole()));
            adminUserDTO.setCreatedDate(Instant.now());
            adminUserDTO.setLastModifiedDate(Instant.now());
            createUser(adminUserDTO);
        }
    }
}
