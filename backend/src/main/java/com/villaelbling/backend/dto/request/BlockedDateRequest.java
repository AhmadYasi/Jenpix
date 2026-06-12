package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class BlockedDateRequest {

    @NotNull(message = "Room ID is required")
    private UUID roomId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String reason;
}
