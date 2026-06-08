package com.primetrade.api.controller;

import com.primetrade.api.dto.ApiResponse;
import com.primetrade.api.dto.TaskRequest;
import com.primetrade.api.dto.TaskResponse;
import com.primetrade.api.entity.User;
import com.primetrade.api.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "CRUD APIs for task management")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {

        TaskResponse task = taskService.createTask(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @GetMapping
    @Operation(summary = "Get all tasks for current user")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal User currentUser) {

        List<TaskResponse> tasks = taskService.getMyTasks(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched successfully", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        TaskResponse task = taskService.getTaskById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task fetched successfully", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {

        TaskResponse task = taskService.updateTask(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }
}
