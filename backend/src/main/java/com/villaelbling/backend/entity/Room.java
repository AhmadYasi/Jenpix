package com.villaelbling.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "room_number", nullable = false, unique = true)
    private Short roomNumber;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Convert(converter = RoomTypeConverter.class)
    @Column(name = "type", nullable = false)
    @ColumnTransformer(write = "?::room_type")
    private RoomType type;

    @Column(name = "standard_occupancy", nullable = false)
    private Short standardOccupancy;

    @Column(name = "occupancy_note", length = 100)
    private String occupancyNote;

    @Column(name = "max_guests", nullable = false)
    private Short maxGuests;

    @Column(name = "price_without_breakfast", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceWithoutBreakfast;

    @Column(name = "breakfast_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal breakfastPrice;

    @Column(name = "price_with_breakfast", insertable = false, updatable = false,
            precision = 10, scale = 2)
    private BigDecimal priceWithBreakfast;

    @Column(name = "extra_bed_allowed", nullable = false)
    private Boolean extraBedAllowed;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    @ColumnTransformer(write = "?::room_status")
    private RoomStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
