package com.dsd.pm.web.rest;

import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.security.AuthoritiesConstants;
import com.dsd.pm.service.NotificationService;
import com.dsd.pm.service.dto.*;
import com.dsd.pm.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class NotificationResource extends BaseResource {

    private static final String ENTITY_NAME = "notifications";
    private final NotificationService notifyService;

    public NotificationResource(UserRepository userRepository, NotificationService notifyService) {
        super(userRepository);
        this.notifyService = notifyService;
    }

    @PostMapping("/notifications")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    public ResponseEntity<ResDTO<NotificationDTO>> create(@RequestBody NotificationDTO dto) {
        if (dto.getId() != null) {
            throw new BadRequestAlertException("A new notification cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NotificationDTO result = notifyService.create(dto);
        return ResponseEntity.ok(ResDTO.success(result));
    }

    @PutMapping("/notifications")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    public ResponseEntity<ResDTO<Void>> update(@RequestBody NotificationDTO dto) {
        ResDTO<Void> result = notifyService.update(dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/notifications/usser-update-watched")
    public ResponseEntity<ResDTO<Void>> updateWatched(@RequestBody NotificationStatusDTO dto) {
        ResDTO<Void> result = notifyService.updateStatusWatched(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.LEADER_SPECIAL + "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    public ResponseEntity<ResDTO<Page<NotificationDTO>>> getAll(Pageable pageable) {
        Page<NotificationDTO> page = notifyService.searchCriteria(pageable, new NotificationSearchDTO());
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @GetMapping("/notifications/{id}")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    public ResponseEntity<ResDTO<NotificationDTO>> getById(@PathVariable Long id) {
        NotificationDTO data = notifyService.findOne(id);
        return ResponseEntity.ok(ResDTO.success(data));
    }

    @PostMapping("/notifications/search")
    @PreAuthorize("hasAnyAuthority(\"" +AuthoritiesConstants.LEADER+ "\", \"" + AuthoritiesConstants.LEADER_SPECIAL + "\")")
    public ResponseEntity<ResDTO<Page<NotificationDTO>>> search(Pageable pageable, @RequestBody NotificationSearchDTO search) {
        Page<NotificationDTO> page = notifyService.searchCriteria(pageable, search);
        return ResponseEntity.ok(ResDTO.success(page));
    }

    @PostMapping("/notifications/get-by-user/{login}")
    public ResponseEntity<ResDTO<List<NotificationDTO>>> getNotifyByUserLogin(@PathVariable String login, Pageable pageable) {
        List<NotificationDTO> page = notifyService.getNotifyByUser(login, pageable);
        return ResponseEntity.ok(ResDTO.success(page));
    }


}
