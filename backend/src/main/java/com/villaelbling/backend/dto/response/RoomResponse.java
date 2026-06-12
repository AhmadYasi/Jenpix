package com.villaelbling.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class RoomResponse {

    private UUID id;
    private Integer roomNumber;
    private String name;
    private String type;                   // "suite", "double", "single"
    private Integer standardOccupancy;
    private Integer maxGuests;
    private String occupancyNote;
    private BigDecimal priceWithoutBreakfast;
    private BigDecimal breakfastPrice;
    private BigDecimal priceWithBreakfast; // generated column value
    private Boolean extraBedAllowed;
    private String description;
    private String status;                 // "active", "inactive", "maintenance"
}
