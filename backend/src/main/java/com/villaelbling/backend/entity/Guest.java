package com.villaelbling.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "guests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "total_stays", nullable = false)
    private Short totalStays;

    @Column(name = "first_booking_at")
    private OffsetDateTime firstBookingAt;

    @Column(name = "last_booking_at")
    private OffsetDateTime lastBookingAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // One guest can have many bookings
    @OneToMany(mappedBy = "guest", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();
}
