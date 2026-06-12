package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.request.BlockedDateRequest;
import com.villaelbling.backend.dto.response.BlockedDateResponse;
import com.villaelbling.backend.entity.BlockedDate;
import com.villaelbling.backend.entity.Room;
import com.villaelbling.backend.repository.BlockedDateRepository;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.BlockedDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlockedDateServiceImpl implements BlockedDateService {

    private final BlockedDateRepository blockedDateRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BlockedDateResponse> getAllBlocked(LocalDate from, LocalDate to) {
        LocalDate windowStart = from != null ? from : LocalDate.now();
        LocalDate windowEnd   = to   != null ? to   : windowStart.plusMonths(3);

        return blockedDateRepository.findAllInWindow(windowStart, windowEnd)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public BlockedDateResponse blockDates(BlockedDateRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End date must be after start date");
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Room not found"));

        BlockedDate blocked = BlockedDate.builder()
                .room(room)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .createdAt(java.time.OffsetDateTime.now())   
                .build();

        BlockedDate saved = blockedDateRepository.save(blocked);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void unblock(UUID id) {
        if (!blockedDateRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Blocked date not found");
        }
        blockedDateRepository.deleteById(id);
    }

    private BlockedDateResponse toResponse(BlockedDate b) {
        return BlockedDateResponse.builder()
                .id(b.getId())
                .roomId(b.getRoom().getId())
                .roomName(b.getRoom().getName())
                .roomNumber(b.getRoom().getRoomNumber().intValue())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .reason(b.getReason())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
