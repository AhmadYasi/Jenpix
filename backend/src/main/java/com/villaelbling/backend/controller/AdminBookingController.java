package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.AdminCreateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingStatusRequest;
import com.villaelbling.backend.dto.response.AdminBookingResponse;
import com.villaelbling.backend.service.AdminBookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    @GetMapping
    public ResponseEntity<List<AdminBookingResponse>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) UUID roomId) {
        return ResponseEntity.ok(adminBookingService.getAllBookings(status, source, roomId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminBookingResponse> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(adminBookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<AdminBookingResponse> createBooking(
            @Valid @RequestBody AdminCreateBookingRequest request) {
        AdminBookingResponse created = adminBookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminBookingResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(adminBookingService.updateStatus(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AdminBookingResponse> updateBooking(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingRequest request) {
        return ResponseEntity.ok(adminBookingService.updateBooking(id, request));
    }
}
