package com.dsd.pm.web.rest;

import com.dsd.pm.service.TargetGroupService;
import com.dsd.pm.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.dsd.pm.domain.TargetGroup}.
 */
@RestController
@RequestMapping("/api/category")
public class TargetGroupResource {

    private final Logger log = LoggerFactory.getLogger(TargetGroupResource.class);

    private final TargetGroupService targetGroupService;

    public TargetGroupResource(TargetGroupService targetGroupService) {
        this.targetGroupService = targetGroupService;
    }

    @PostMapping("/target-groups")
    public ResponseEntity<ResDTO<Void>> createTargetGroup(@Valid @RequestBody TargetGroupDTO dto) {
        ResDTO<Void> result = targetGroupService.save(dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/target-groups/search")
    public ResponseEntity<ResDTO<Page<TargetGroupDTO>>> search(Pageable pageable, @RequestBody TargetGroupDTO search) {
        Page<TargetGroupDTO> page = targetGroupService.searchTargetGroup(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/target-groups")
    public ResponseEntity<ResDTO<List<TargetGroupDTO>>> getAllTargetGroups() {
        List<TargetGroupDTO> dtos = targetGroupService.findAll();
        return ResponseEntity.ok(ResDTO.success(dtos));
    }

    @GetMapping("/target-groups/{id}")
    public ResponseEntity<TargetGroupDTO> getTargetGroup(@PathVariable Long id) {
        log.debug("REST request to get TargetGroup : {}", id);
        Optional<TargetGroupDTO> targetGroupDTO = targetGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(targetGroupDTO);
    }

    @DeleteMapping("/target-groups/{id}")
    public ResponseEntity<ResDTO<Void>> deleteTargetGroup(@PathVariable Long id) {
        log.debug("REST request to delete TargetGroup : {}", id);
        ResDTO<Void> res = targetGroupService.delete(id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/target-groups/get-by-project-code")
    public ResponseEntity<ResDTO<List<ProTargetGroupDTO>>> getTargetGroupByProject(@RequestParam(value = "projectCode", required = false) String projectCode) {
        log.debug("REST request to get TargetGroups get-by-project");
        List<ProTargetGroupDTO> res = targetGroupService.getTargetGroupByProject(projectCode);
        return ResponseEntity.ok(ResDTO.success(res));
    }

}
