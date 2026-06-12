package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.request.BlockedDateRequest;
import com.villaelbling.backend.dto.response.BlockedDateResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BlockedDateService {
    List<BlockedDateResponse> getAllBlocked(LocalDate from, LocalDate to);
    BlockedDateResponse blockDates(BlockedDateRequest request);
    void unblock(UUID id);
}
