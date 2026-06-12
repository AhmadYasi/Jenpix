package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.UpdateRoomRequest;
import com.villaelbling.backend.dto.response.RoomResponse;
import com.villaelbling.backend.service.AdminRoomService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminRoomController {

    private final AdminRoomService adminRoomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(adminRoomService.getAllRooms());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoomRequest request) {
        return ResponseEntity.ok(adminRoomService.updateRoom(id, request));
    }
}
