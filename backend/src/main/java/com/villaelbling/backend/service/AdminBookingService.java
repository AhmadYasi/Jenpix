package com.villaelbling.backend.service;

import com.villaelbling.backend.dto.request.AdminCreateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingStatusRequest;
import com.villaelbling.backend.dto.response.AdminBookingResponse;

import java.util.List;
import java.util.UUID;

public interface AdminBookingService {
    List<AdminBookingResponse> getAllBookings(String status, String source, UUID roomId);
    AdminBookingResponse getBookingById(UUID id);
    AdminBookingResponse updateStatus(UUID id, UpdateBookingStatusRequest request);
    AdminBookingResponse updateBooking(UUID id, UpdateBookingRequest request);
    AdminBookingResponse createBooking(AdminCreateBookingRequest request);
}
