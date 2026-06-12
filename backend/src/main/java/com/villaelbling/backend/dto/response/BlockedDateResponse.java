package com.villaelbling.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class BlockedDateResponse {
    private UUID id;
    private UUID roomId;
    private String roomName;
    private Integer roomNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private OffsetDateTime createdAt;
}
