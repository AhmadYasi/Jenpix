package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.request.UpdateRoomRequest;
import com.villaelbling.backend.dto.response.RoomResponse;
import com.villaelbling.backend.entity.Room;
import com.villaelbling.backend.entity.RoomStatus;
import com.villaelbling.backend.entity.RoomType;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.AdminRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminRoomServiceImpl implements AdminRoomService {

    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        // ALL rooms (active, inactive, maintenance), ordered by room number for a stable admin list.
        return roomRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Room::getRoomNumber))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(UUID id, UpdateRoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Room not found"));

        // Parse status
        RoomStatus newStatus;
        try {
            newStatus = RoomStatus.valueOf(request.getStatus().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status: " + request.getStatus()
                            + ". Valid values: active, inactive, maintenance");
        }

        // Apply updates — room number and type are immutable
        room.setName(request.getName());
        room.setPriceWithoutBreakfast(request.getPriceWithoutBreakfast());
        room.setBreakfastPrice(request.getBreakfastPrice());
        room.setMaxGuests(request.getMaxGuests().shortValue());
        room.setStandardOccupancy(request.getStandardOccupancy().shortValue());
        room.setOccupancyNote(request.getOccupancyNote());
        room.setExtraBedAllowed(request.getExtraBedAllowed());
        room.setDescription(request.getDescription());
        room.setStatus(newStatus);

        Room saved = roomRepository.save(room);
        return toResponse(saved);
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber().intValue())
                .name(room.getName())
                .type(typeToString(room.getType()))
                .standardOccupancy(room.getStandardOccupancy().intValue())
                .maxGuests(room.getMaxGuests().intValue())
                .occupancyNote(room.getOccupancyNote())
                .priceWithoutBreakfast(room.getPriceWithoutBreakfast())
                .breakfastPrice(room.getBreakfastPrice())
                .priceWithBreakfast(room.getPriceWithBreakfast())
                .extraBedAllowed(room.getExtraBedAllowed())
                .description(room.getDescription())
                .status(room.getStatus().name())
                .build();
    }

    private String typeToString(RoomType type) {
        return type == RoomType.double_ ? "double" : type.name();
    }
}
