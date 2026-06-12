package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.BookingRequest;
import com.villaelbling.backend.dto.response.BookingResponse;
import com.villaelbling.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;


    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
