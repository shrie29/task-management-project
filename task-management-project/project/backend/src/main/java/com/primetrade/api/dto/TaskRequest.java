package com.primetrade.api.dto;

import com.primetrade.api.entity.Task;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Task.Priority priority;

    private Task.Status status;
}
