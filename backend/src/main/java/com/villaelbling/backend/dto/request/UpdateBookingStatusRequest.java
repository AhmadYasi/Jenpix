package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;
}
