package com.dsd.pm.web.rest;

import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.AuthoritiesConstants;
import com.dsd.pm.service.ProjectService;
import com.dsd.pm.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;

/**
 * REST controller for managing {@link com.dsd.pm.domain.Project}.
 */
@RestController
@RequestMapping("/api")
public class ProjectResource extends BaseResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);
    private final ProjectService service;

    public ProjectResource(UserRepository userRepository, ProjectService service) {
        super(userRepository);
        this.service = service;
    }

    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    @PostMapping("/projects/save")
    public ResponseEntity<ResDTO<Void>> createProject(@Valid @RequestBody CreateProjectDTO dto) {
        log.debug("REST request to save Project : {}", dto);
        ResDTO<Void> res = service.save(dto);
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    @PostMapping("/projects/search")
    public ResponseEntity<ResDTO<PageExt<ProjectDTO>>> search(Pageable pageable, @Valid @RequestBody ProjectSearchDTO dto) {
        log.debug("REST request to get a page of Projects");
        dto = this.projectSearchForm(dto);
        PageExt<ProjectDTO> page = service.search(pageable, dto);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    @GetMapping("/projects/{id}")
    public ResponseEntity<ResDTO<ProjectDTO>> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        ResDTO<ProjectDTO> res = service.findById(id);
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ResDTO<Void>> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);
        ResDTO<Void> res =service.delete(id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/projects/get-select-box")
    public ResponseEntity<ResDTO<List<SelectBoxDTO>>> getTargetGroupSelectBox() {
        log.debug("REST request to get all select-box TargetGroups");
        List<SelectBoxDTO> res = service.getProjectSelectBox();
        return ResponseEntity.ok(ResDTO.success(res));
    }

    @GetMapping("/projects/get-all-code")
    public ResponseEntity<ResDTO<List<String>>> getAllCode() {
        List<String> code = service.getAllCode();
        return ResponseEntity.ok(ResDTO.success(code));
    }

    @GetMapping("/projects/find-selected-target-group/{project-code}")
    public ResponseEntity<ResDTO<List<String>>> findSelectedTargetGroup(@PathVariable("project-code") String projectCode) {
        List<String> code = service.findSelectedTargetGroup(projectCode);
        return ResponseEntity.ok(ResDTO.success(code));
    }

    @GetMapping("/projects/find-user-by-project/{project-code}")
    public ResponseEntity<ResDTO<List<AssigneeUserDTO>>> findUserByProjectCode(@PathVariable("project-code") String projectCode) {
        List<AssigneeUserDTO> users = service.findSelectedUserByProject(projectCode);
        return ResponseEntity.ok(ResDTO.success(users));
    }
}

