package com.dsd.pm.web.rest;

import com.dsd.pm.repository.UserRepository;
import com.dsd.pm.service.TasksService;
import com.dsd.pm.service.dto.*;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by sonba@itsol.vn
 * Date: 29/05/2021
 * Time: 9:18 PM
 */
@RestController
@RequestMapping(value = "/api")
public class TasksResource extends BaseResource {

    private final TasksService tasksService;

    public TasksResource(TasksService tasksService, UserRepository userRepository) {
        super(userRepository);
        this.tasksService = tasksService;
    }

    @GetMapping(value = "/tasks/get-all")
    public ResponseEntity<ResDTO<List<TasksDTO>>> findAll() {
        List<TasksDTO> result = tasksService.findAllTask();
        return ResponseEntity.ok(ResDTO.success(result));
    }

    @PostMapping("/tasks")
    public ResponseEntity<ResDTO<Long>> createdTasks(@Valid @RequestBody TasksDTO tasksDTO) {
        ResDTO<Long> result = tasksService.createdTasks(tasksDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/tasks")
    public ResponseEntity<ResDTO<Long>> updateTasks(@Valid @RequestBody TasksDTO tasksDTO) {
        ResDTO<Long> result = tasksService.updateTasks(tasksDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/tasks/search")
    public ResponseEntity<ResDTO<PageExt<TaskSearchResDTO>>> search(Pageable pageable, @Valid @RequestBody TaskSearchDTO dto) {
        dto = this.taskSearchForm(dto);
        PageExt<TaskSearchResDTO> result = tasksService.search(pageable, dto);
        return ResponseEntity.ok(ResDTO.success(result));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ResDTO<TasksDTO>> getTask(@PathVariable Long id) {
        TasksDTO tasksDTO = tasksService.findOne(id);
        return ResponseEntity.ok(ResDTO.success(tasksDTO));
    }
}
