package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.request.UpdateRoomRequest;
import com.villaelbling.backend.dto.response.RoomResponse;

import java.util.List;
import java.util.UUID;

public interface AdminRoomService {
    List<RoomResponse> getAllRooms();
    RoomResponse updateRoom(UUID id, UpdateRoomRequest request);
}
