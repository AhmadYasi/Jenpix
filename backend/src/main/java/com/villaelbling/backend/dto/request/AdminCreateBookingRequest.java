package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class AdminCreateBookingRequest {

    @NotNull(message = "Room ID is required")
    private UUID roomId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in must not be in the past")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out must be a future date")
    private LocalDate checkOut;

    @NotNull(message = "Number of adults is required")
    @Min(value = 1, message = "At least 1 adult is required")
    @Max(value = 4, message = "Maximum 4 adults")
    private Integer adults;

    @NotNull(message = "Number of children is required")
    @Min(value = 0, message = "Children cannot be negative")
    @Max(value = 3, message = "Maximum 3 children")
    private Integer children;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name too long")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name too long")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    @Size(max = 255, message = "Email too long")
    private String email;

    @Size(max = 50, message = "Phone number too long")
    private String phone;

    @NotNull(message = "Please specify whether breakfast is included")
    private Boolean includeBreakfast;

    @Size(max = 1000, message = "Special requests too long")
    private String specialRequests;

    // Admin-supplied fields (the whole point of this endpoint)
    @NotBlank(message = "Booking source is required")
    private String source;   // "Booking.com" | "Website" | "Phone" | "Email"

    @NotBlank(message = "Status is required")
    private String status;   // "confirmed" | "pending" | "cancelled"

    // Optional extra bed. Null/blank/"none" => no extra bed.
    // Valid: "none" | "child_0_5" | "child_6_15" | "adult_16"
    private String extraBedTier;
}
