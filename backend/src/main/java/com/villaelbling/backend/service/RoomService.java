package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.request.AvailabilityRequest;
import com.villaelbling.backend.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {
    List<RoomResponse> getAllActiveRooms();
    List<RoomResponse> getAvailableRooms(AvailabilityRequest request);
}
