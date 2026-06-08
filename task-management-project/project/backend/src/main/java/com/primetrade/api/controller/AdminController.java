package com.primetrade.api.controller;

import com.primetrade.api.dto.ApiResponse;
import com.primetrade.api.dto.TaskResponse;
import com.primetrade.api.entity.User;
import com.primetrade.api.repository.UserRepository;
import com.primetrade.api.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only endpoints")
public class AdminController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping("/tasks")
    @Operation(summary = "Get ALL tasks in the system (Admin only)")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        List<TaskResponse> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success("All tasks fetched", tasks));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users (Admin only)")
    public ResponseEntity<ApiResponse<List<String>>> getAllUsers() {
        List<String> usernames = userRepository.findAll()
                .stream()
                .map(User::getUsername)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("All users fetched", usernames));
    }
}
