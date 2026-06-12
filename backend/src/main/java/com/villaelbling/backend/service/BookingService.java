package com.villaelbling.backend.service;
import com.villaelbling.backend.dto.request.BookingRequest;
import com.villaelbling.backend.dto.response.BookingResponse;


public interface BookingService {
    BookingResponse createBooking(BookingRequest request);
}
