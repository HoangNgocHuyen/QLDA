package com.dsd.pm.web.rest;

import com.dsd.pm.domain.Targets;
import com.dsd.pm.enums.MessageEnum;
import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.AuthoritiesConstants;
import com.dsd.pm.service.TargetService;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TargetResource extends BaseResource {

    private final Logger log = LoggerFactory.getLogger(TargetResource.class);

    private static final String ENTITY_NAME = "targets";
    private final TargetService targetService;

    public TargetResource(UserRepository userRepository, TargetService targetService) {
        super(userRepository);
        this.targetService = targetService;
    }

    @PostMapping("/targets")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<TargetDTO>> createtargets(@RequestBody TargetDTO targetDTO) throws URISyntaxException {
        log.debug("REST request to save targets : {}", targetDTO);
        if (targetDTO.getId() != null) {
            throw new BadRequestAlertException("A new targets cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TargetDTO result = targetService.save(targetDTO);
        return ResponseEntity.ok(ResDTO.success(result));
    }

    @PutMapping("/targets")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<TargetDTO>> updatetargets(@RequestBody TargetDTO targetDTO) throws URISyntaxException {
        log.debug("REST request to update targets : {}", targetDTO);
        if (targetDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TargetDTO result = targetService.save(targetDTO);
        return ResponseEntity.ok(ResDTO.success(result));
    }

    @GetMapping("/targets")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<Page<TargetDTO>>> getAlltargets(Pageable pageable) {
        log.debug("REST request to get a page of targets");
        TargetSearchDTO search = new TargetSearchDTO();
        Page<TargetDTO> page = targetService.findAll(pageable);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/targets/{id}")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<TargetDTO>> getTargets(@PathVariable Long id) {
        log.debug("REST request to get targets : {}", id);
        TargetDTO targetDTO = targetService.findOne(id);
        return ResponseEntity.ok(ResDTO.success(targetDTO));
    }

    @DeleteMapping("/targets/{id}")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<Void> deletetargets(@PathVariable Long id) {
        log.debug("REST request to delete targets : {}", id);
        targetService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/targets/search")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<Page<TargetDTO>>> search(Pageable pageable, @RequestBody TargetSearchDTO search) {
//        Page<targetsDTO> page = targetsService.search(pageable, search);
        search = this.targetSearchForm(search);
        Page<TargetDTO> page = targetService.searchCriteria(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @PostMapping("/targets/search-new")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<PageExt<TargetSearchResultDTO>>> searchNew(Pageable pageable, @RequestBody TargetSearchDTO search) {
        search = this.targetSearchForm(search);
        PageExt<TargetSearchResultDTO> page = targetService.searchSql(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/targets/get-select-box")
    public ResponseEntity<ResDTO<List<TargetSelectBoxDTO>>> getTargetselectBox() {
        List<TargetSelectBoxDTO> data = targetService.getTargetSelectBox();
        return ResponseEntity.ok(ResDTO.success(data));
    }

    @PostMapping("/targets/add-by-excel")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.EMPLOYEE_SPECIAL + "\")")
    public ResponseEntity<ResDTO<List<TargetDTO>>> addByExcel(@Valid TargetImport fileImport) {
        TargetImport result = targetService.validateFileImport(fileImport);
        if (result == null) {
            return ResponseEntity.ok(ResDTO.error(MessageEnum.IMPORT_FILE_ERROR));
        }
        if (!result.isValid()) {
            return ResponseEntity.ok(ResDTO.error(MessageEnum.IMPORT_FILE_ERROR, result.getData()));
        }
        List<TargetDTO> res = targetService.saveListTarget(result.getData());
        return ResponseEntity.ok(ResDTO.success(res));
    }
}
