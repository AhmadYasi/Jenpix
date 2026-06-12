package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingRequest {

    @NotBlank(message = "Guest name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Adults is required")
    @Min(value = 1, message = "At least 1 adult is required")
    private Integer adults;

    @NotNull(message = "Children is required")
    @Min(value = 0, message = "Children cannot be negative")
    private Integer children;
}
