package com.villaelbling.backend.dto.response;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID id;
    private String bookingReference;       // VE-XXXXXX

    // Room summary — guest doesn't need full room object
    private Integer roomNumber;
    private String roomName;

    // Stay details
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer nights;
    private Integer adults;
    private Integer children;
    private Boolean breakfastIncluded;

    // Pricing — always recalculated server-side, never trusted from frontend
    private BigDecimal pricePerNight;
    private BigDecimal breakfastPrice;
    private BigDecimal totalPrice;

    // Guest summary
    private String guestName;
    private String guestEmail;

    private String status;
    private String specialRequests;
    private OffsetDateTime createdAt;
}
