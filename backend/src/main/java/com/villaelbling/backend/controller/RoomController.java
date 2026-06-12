package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.AvailabilityRequest;
import com.villaelbling.backend.dto.response.RoomResponse;
import com.villaelbling.backend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;


    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllActiveRooms());
    }


    @GetMapping("/availability")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @Valid @ModelAttribute AvailabilityRequest request) {
        return ResponseEntity.ok(roomService.getAvailableRooms(request));
    }
}
