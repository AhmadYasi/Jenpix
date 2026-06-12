package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AvailabilityRequest {

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in must not be in the past")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out must be a future date")
    private LocalDate checkOut;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "At least 1 guest required")
    @Max(value = 4, message = "Maximum 4 guests")
    private Integer guests;
}
