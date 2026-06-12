package com.villaelbling.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 20)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "nights", insertable = false, updatable = false)
    private Short nights;

    @Column(name = "adults", nullable = false)
    private Short adults;

    @Column(name = "children", nullable = false)
    private Short children;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "breakfast_included", nullable = false)
    private Boolean breakfastIncluded;

    @Column(name = "breakfast_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal breakfastPrice;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "commission", nullable = false, precision = 5, scale = 2)
    private BigDecimal commission;

    @Column(name = "net_revenue", insertable = false, updatable = false,
            precision = 10, scale = 2)
    private BigDecimal netRevenue;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "source", nullable = false)
    @ColumnTransformer(write = "?::booking_source")
    private BookingSource source;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    @ColumnTransformer(write = "?::booking_status")
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "extra_bed_tier", nullable = false)
    @ColumnTransformer(write = "?::extra_bed_tier")
    private ExtraBedTier extraBedTier;

    @Column(name = "extra_bed_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal extraBedPrice;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
