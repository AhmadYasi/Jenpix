package com.villaelbling.backend.service.impl;
import com.villaelbling.backend.dto.request.AvailabilityRequest;
import com.villaelbling.backend.dto.response.RoomResponse;
import com.villaelbling.backend.entity.BookingStatus;
import com.villaelbling.backend.entity.Room;
import com.villaelbling.backend.entity.RoomStatus;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.villaelbling.backend.entity.RoomType;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomServiceImpl  implements RoomService {
    private final RoomRepository roomRepository;

    @Override
    public List<RoomResponse> getAllActiveRooms() {
        return roomRepository.findByStatus(RoomStatus.active)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<RoomResponse> getAvailableRooms(AvailabilityRequest request) {
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in");
        }

        return roomRepository.findAvailableRooms(
                        request.getCheckIn(),
                        request.getCheckOut(),
                        request.getGuests(),
                        BookingStatus.cancelled)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber().intValue())
                .name(room.getName())
                .type(roomTypeToString(room.getType()))
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

    private String roomTypeToString(RoomType type) {
        return type == RoomType.double_ ? "double" : type.name();
    }
}
