package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.request.BookingRequest;
import com.villaelbling.backend.dto.response.BookingResponse;
import com.villaelbling.backend.entity.*;
import com.villaelbling.backend.repository.BookingRepository;
import com.villaelbling.backend.repository.GuestRepository;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.BookingService;
import com.villaelbling.backend.util.BookingReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.villaelbling.backend.entity.ExtraBedTier;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements  BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;
    private final BookingReferenceGenerator referenceGenerator;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {


        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in");
        }


        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room not found"));

        if (room.getStatus() != RoomStatus.active) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Room is not currently available for booking");
        }


        int totalGuests = request.getAdults() + request.getChildren();
        if (totalGuests > room.getMaxGuests()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Guest count " + totalGuests + " exceeds room capacity of " + room.getMaxGuests());
        }


        boolean overlaps = bookingRepository.existsOverlappingBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                BookingStatus.cancelled);
        if (overlaps) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room is no longer available for the selected dates");
        }


        Guest guest = guestRepository.findByEmail(request.getEmail())
                .orElseGet(() -> guestRepository.save(
                        Guest.builder()
                                .fullName(request.getFirstName() + " " + request.getLastName())
                                .email(request.getEmail())
                                .phone(request.getPhone())
                                .totalStays((short) 0)
                                .firstBookingAt(java.time.OffsetDateTime.now())
                                .lastBookingAt(java.time.OffsetDateTime.now())
                                .build()
                ));


        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal pricePerNight = room.getPriceWithoutBreakfast();
        BigDecimal breakfastPrice = request.getIncludeBreakfast()
                ? room.getBreakfastPrice()
                : BigDecimal.ZERO;
        BigDecimal totalPrice = pricePerNight
                .add(breakfastPrice)
                .multiply(BigDecimal.valueOf(nights));


        String reference;
        do {
            reference = referenceGenerator.generate();
        } while (bookingRepository.findByBookingReference(reference).isPresent());


        Booking booking = Booking.builder()
                .bookingReference(reference)
                .room(room)
                .guest(guest)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .adults(request.getAdults().shortValue())
                .children(request.getChildren().shortValue())
                .pricePerNight(pricePerNight)
                .breakfastIncluded(request.getIncludeBreakfast())
                .breakfastPrice(breakfastPrice)
                .totalPrice(totalPrice)
                .commission(BigDecimal.ZERO)
                .source(BookingSource.website)
                .status(BookingStatus.confirmed)
                .extraBedTier(ExtraBedTier.none)
                .extraBedPrice(BigDecimal.ZERO)
                .specialRequests(request.getSpecialRequests())
                .createdAt(java.time.OffsetDateTime.now())   // ← add this line
                .build();

        Booking saved = bookingRepository.save(booking);

        return BookingResponse.builder()
                .id(saved.getId())
                .bookingReference(saved.getBookingReference())
                .roomNumber(room.getRoomNumber().intValue())
                .roomName(room.getName())
                .checkIn(saved.getCheckIn())
                .checkOut(saved.getCheckOut())
                .nights((int) nights)
                .adults(request.getAdults())
                .children(request.getChildren())
                .breakfastIncluded(saved.getBreakfastIncluded())
                .pricePerNight(saved.getPricePerNight())
                .breakfastPrice(saved.getBreakfastPrice())
                .totalPrice(saved.getTotalPrice())
                .guestName(guest.getFullName())
                .guestEmail(guest.getEmail())
                .status(saved.getStatus().name())
                .specialRequests(saved.getSpecialRequests())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
