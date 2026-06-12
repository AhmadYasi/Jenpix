package com.villaelbling.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminBookingResponse {

    private UUID id;
    private String bookingReference;
    private OffsetDateTime createdAt;

    private String guestName;
    private String guestEmail;
    private String guestPhone;

    private UUID roomId;
    private String roomName;
    private Integer roomNumber;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer nights;

    private Integer adults;
    private Integer children;

    private Boolean breakfastIncluded;
    private BigDecimal pricePerNight;
    private BigDecimal breakfastPrice;
    private BigDecimal totalPrice;

    private String source;
    private String status;

    // Extra bed (admin feature)
    private String extraBedTier;        // "none" | "child_0_5" | "child_6_15" | "adult_16"
    private BigDecimal extraBedPrice;   // total extra-bed fee for the stay (0 if none / free tier)

    private String specialRequests;
    private String internalNotes;
}
