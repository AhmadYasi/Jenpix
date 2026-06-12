package com.villaelbling.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateRoomRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotNull(message = "Price without breakfast is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal priceWithoutBreakfast;

    @NotNull(message = "Breakfast price is required")
    @DecimalMin(value = "0.0", message = "Breakfast price cannot be negative")
    private BigDecimal breakfastPrice;

    @NotNull(message = "Max guests is required")
    @Min(value = 1, message = "Max guests must be at least 1")
    @Max(value = 6, message = "Max guests cannot exceed 6")
    private Integer maxGuests;

    @NotNull(message = "Standard occupancy is required")
    @Min(value = 1)
    private Integer standardOccupancy;

    private String occupancyNote;

    @NotNull(message = "Extra bed allowed is required")
    private Boolean extraBedAllowed;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;
}
