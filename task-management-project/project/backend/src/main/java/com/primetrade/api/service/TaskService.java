package com.primetrade.api.service;

import com.primetrade.api.dto.TaskRequest;
import com.primetrade.api.dto.TaskResponse;
import com.primetrade.api.entity.Task;
import com.primetrade.api.entity.User;
import com.primetrade.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // Create a new task for the logged-in user
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Task.Status.TODO)
                .priority(request.getPriority())
                .user(currentUser)
                .build();

        return TaskResponse.from(taskRepository.save(task));
    }

    // Get all tasks owned by the current user
    public List<TaskResponse> getMyTasks(User currentUser) {
        return taskRepository.findByUser(currentUser)
                .stream()
                .map(TaskResponse::from)
                .collect(Collectors.toList());
    }

    // Get a single task (user can only see their own; admin sees all)
    public TaskResponse getTaskById(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to view this task");
        }

        return TaskResponse.from(task);
    }

    // Update task (owner or admin)
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }

        if (request.getTitle() != null)       task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null)      task.setStatus(request.getStatus());
        if (request.getPriority() != null)    task.setPriority(request.getPriority());

        return TaskResponse.from(taskRepository.save(task));
    }

    // Delete task (owner or admin)
    public void deleteTask(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    // ADMIN: get all tasks in the system
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskResponse::from)
                .collect(Collectors.toList());
    }
}
