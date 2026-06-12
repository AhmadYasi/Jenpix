package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.request.AdminCreateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingRequest;
import com.villaelbling.backend.dto.request.UpdateBookingStatusRequest;
import com.villaelbling.backend.dto.response.AdminBookingResponse;
import com.villaelbling.backend.entity.Booking;
import com.villaelbling.backend.entity.BookingSource;
import com.villaelbling.backend.entity.BookingStatus;
import com.villaelbling.backend.entity.ExtraBedTier;
import com.villaelbling.backend.entity.Guest;
import com.villaelbling.backend.entity.Room;
import com.villaelbling.backend.entity.RoomStatus;
import com.villaelbling.backend.repository.BookingRepository;
import com.villaelbling.backend.repository.GuestRepository;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.AdminBookingService;
import com.villaelbling.backend.util.BookingReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingReferenceGenerator referenceGenerator;

    // ── Extra-bed tier prices (per night, breakfast included) ──
    // Source of truth: Gundel Woite, confirmed June 2026.
    //   0–5 years : free
    //   6–15 years: €30 / night
    //   16+ years : €45 / night
    // If these change, edit here (single source of truth for extra-bed pricing).
    private static final BigDecimal EXTRA_BED_CHILD_6_15 = new BigDecimal("30.00");
    private static final BigDecimal EXTRA_BED_ADULT_16   = new BigDecimal("45.00");

    @Override
    @Transactional(readOnly = true)
    public List<AdminBookingResponse> getAllBookings(String status, String source, UUID roomId) {
        return bookingRepository.findAll()
                .stream()
                .filter(b -> status == null || b.getStatus().name().equalsIgnoreCase(status))
                .filter(b -> source == null || b.getSource().name().equalsIgnoreCase(source))
                .filter(b -> roomId == null || b.getRoom().getId().equals(roomId))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBookingResponse getBookingById(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));
        return toResponse(booking);
    }

    @Override
    @Transactional
    public AdminBookingResponse updateStatus(UUID id, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));

        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(request.getStatus().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status: " + request.getStatus()
                            + ". Valid values: pending, confirmed, cancelled, no_show, completed");
        }

        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public AdminBookingResponse updateBooking(UUID id, UpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));

        // Capacity check — new guest count must fit the room
        int totalGuests = request.getAdults() + request.getChildren();
        int maxGuests = booking.getRoom().getMaxGuests().intValue();
        if (totalGuests > maxGuests) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Guest count (" + totalGuests + ") exceeds room capacity ("
                            + maxGuests + ")");
        }

        Guest guest = booking.getGuest();

        // Duplicate-email guard: if email is changing, ensure no other guest owns it
        String newEmail = request.getEmail().trim();
        if (!newEmail.equalsIgnoreCase(guest.getEmail())) {
            guestRepository.findByEmail(newEmail).ifPresent(existing -> {
                if (!existing.getId().equals(guest.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "A guest with this email already exists");
                }
            });
        }

        // Update guest details in place
        guest.setFullName(request.getFullName().trim());
        guest.setEmail(newEmail);
        guest.setPhone(request.getPhone().trim());
        guestRepository.save(guest);

        // Update booking guest count (no price recalculation — flat pricing)
        booking.setAdults(request.getAdults().shortValue());
        booking.setChildren(request.getChildren().shortValue());
        Booking saved = bookingRepository.save(booking);

        return toResponse(saved);
    }

    @Override
    @Transactional
    public AdminBookingResponse createBooking(AdminCreateBookingRequest request) {

        // 1. Date order
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in");
        }

        // 2. Room must exist
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room not found"));

        // 3. Room must be active
        if (room.getStatus() != RoomStatus.active) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Room is not currently available for booking");
        }

        // 4. Resolve extra-bed tier (defaults to none)
        ExtraBedTier extraBedTier = mapExtraBedTier(request.getExtraBedTier());

        // 4a. If an extra bed is requested, the room must allow it
        if (extraBedTier != ExtraBedTier.none && !Boolean.TRUE.equals(room.getExtraBedAllowed())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This room does not allow an extra bed");
        }

        // 5. Capacity — base guests, plus the extra-bed occupant if present
        int baseGuests = request.getAdults() + request.getChildren();
        int totalGuests = baseGuests + (extraBedTier != ExtraBedTier.none ? 1 : 0);
        if (totalGuests > room.getMaxGuests()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Guest count " + totalGuests + " exceeds room capacity of " + room.getMaxGuests());
        }

        // 6. Overlap
        boolean overlaps = bookingRepository.existsOverlappingBooking(
                room.getId(),
                request.getCheckIn(),
                request.getCheckOut(),
                BookingStatus.cancelled);
        if (overlaps) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room is no longer available for the selected dates");
        }

        // 7. Admin-supplied source + status
        BookingSource source = mapSource(request.getSource());
        BookingStatus status;
        try {
            status = BookingStatus.valueOf(request.getStatus().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status: " + request.getStatus()
                            + ". Valid values: pending, confirmed, cancelled, no_show, completed");
        }

        // 8. Find-or-create guest
        Guest guest = guestRepository.findByEmail(request.getEmail())
                .orElseGet(() -> guestRepository.save(
                        Guest.builder()
                                .fullName(request.getFirstName() + " " + request.getLastName())
                                .email(request.getEmail())
                                .phone(request.getPhone())
                                .totalStays((short) 0)
                                .firstBookingAt(OffsetDateTime.now())
                                .lastBookingAt(OffsetDateTime.now())
                                .build()
                ));

        // 9. Pricing
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        BigDecimal pricePerNight = room.getPriceWithoutBreakfast();

        // Main-room breakfast: €13 × standard occupancy (already stored as room.breakfastPrice).
        // The extra-bed occupant is NOT counted here — their breakfast is bundled in the bed fee.
        BigDecimal breakfastPrice = request.getIncludeBreakfast()
                ? room.getBreakfastPrice()
                : BigDecimal.ZERO;

        // Extra-bed fee per night (breakfast included in this figure)
        BigDecimal extraBedPerNight = extraBedFeePerNight(extraBedTier);

        // Total = (room + breakfast + extra-bed) × nights
        BigDecimal totalPrice = pricePerNight
                .add(breakfastPrice)
                .add(extraBedPerNight)
                .multiply(BigDecimal.valueOf(nights));

        // Stored extra-bed total for the stay
        BigDecimal extraBedTotal = extraBedPerNight.multiply(BigDecimal.valueOf(nights));

        // 10. Unique reference
        String reference;
        do {
            reference = referenceGenerator.generate();
        } while (bookingRepository.findByBookingReference(reference).isPresent());

        // 11. Persist
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
                .source(source)
                .status(status)
                .extraBedTier(extraBedTier)
                .extraBedPrice(extraBedTotal)
                .specialRequests(request.getSpecialRequests())
                .createdAt(OffsetDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    // Per-night extra-bed fee (breakfast included). 0 for none and the free 0–5 tier.
    private BigDecimal extraBedFeePerNight(ExtraBedTier tier) {
        switch (tier) {
            case child_6_15: return EXTRA_BED_CHILD_6_15;
            case adult_16:   return EXTRA_BED_ADULT_16;
            case child_0_5:  // free
            case none:
            default:         return BigDecimal.ZERO;
        }
    }

    // Map incoming string to ExtraBedTier. Null/blank/"none" => none.
    private ExtraBedTier mapExtraBedTier(String value) {
        if (value == null || value.trim().isEmpty()) {
            return ExtraBedTier.none;
        }
        try {
            return ExtraBedTier.valueOf(value.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid extra bed tier: " + value
                            + ". Valid values: none, child_0_5, child_6_15, adult_16");
        }
    }

    // Map the frontend source label to the BookingSource enum.
    private BookingSource mapSource(String label) {
        if (label == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking source is required");
        }
        String s = label.trim().toLowerCase();
        switch (s) {
            case "booking.com":
            case "booking_com":
                return BookingSource.booking_com;
            case "website":
                return BookingSource.website;
            case "phone":
                return BookingSource.phone;
            case "email":
                return BookingSource.email;
            case "walk_in":
            case "walk-in":
                return BookingSource.walk_in;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid source: " + label
                                + ". Valid values: Booking.com, Website, Phone, Email");
        }
    }

    private AdminBookingResponse toResponse(Booking b) {
        long nights = ChronoUnit.DAYS.between(b.getCheckIn(), b.getCheckOut());
        return AdminBookingResponse.builder()
                .id(b.getId())
                .bookingReference(b.getBookingReference())
                .createdAt(b.getCreatedAt())
                .guestName(b.getGuest().getFullName())
                .guestEmail(b.getGuest().getEmail())
                .guestPhone(b.getGuest().getPhone())
                .roomId(b.getRoom().getId())
                .roomName(b.getRoom().getName())
                .roomNumber(b.getRoom().getRoomNumber().intValue())
                .checkIn(b.getCheckIn())
                .checkOut(b.getCheckOut())
                .nights((int) nights)
                .adults(b.getAdults().intValue())
                .children(b.getChildren().intValue())
                .breakfastIncluded(b.getBreakfastIncluded())
                .pricePerNight(b.getPricePerNight())
                .breakfastPrice(b.getBreakfastPrice())
                .totalPrice(b.getTotalPrice())
                .source(b.getSource().name())
                .status(b.getStatus().name())
                .extraBedTier(b.getExtraBedTier() != null ? b.getExtraBedTier().name() : "none")
                .extraBedPrice(b.getExtraBedPrice())
                .specialRequests(b.getSpecialRequests())
                .internalNotes(b.getInternalNotes())
                .build();
    }
}
