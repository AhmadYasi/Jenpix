package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.response.DashboardStatsResponse;
import com.villaelbling.backend.entity.BookingStatus;
import com.villaelbling.backend.entity.RoomStatus;
import com.villaelbling.backend.repository.BookingRepository;
import com.villaelbling.backend.repository.RoomRepository;
import com.villaelbling.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    @Override
    public DashboardStatsResponse getStats() {
        LocalDate today = LocalDate.now();

        // Arrivals today — check-in date is today, not cancelled
        int arrivalsToday = (int) bookingRepository.findByCheckInOn(today)
                .stream()
                .filter(b -> b.getStatus() != BookingStatus.cancelled)
                .count();

        // Departures today — check-out date is today, not cancelled
        int departuresToday = (int) bookingRepository.findByCheckOutOn(today)
                .stream()
                .filter(b -> b.getStatus() != BookingStatus.cancelled)
                .count();

        // Occupied rooms — bookings where today falls within check-in/check-out
        int occupiedRooms = (int) bookingRepository.findAll()
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.confirmed
                        && !b.getCheckIn().isAfter(today)
                        && b.getCheckOut().isAfter(today))
                .count();

        // Total active rooms
        int totalRooms = roomRepository.findByStatus(RoomStatus.active).size();

        // Upcoming bookings — check-in is today or later, confirmed

        LocalDate upcomingCutoff = today.plusDays(15);
        int upcomingBookings = (int) bookingRepository.findUpcomingFrom(today)
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.confirmed)
                .filter(b -> !b.getCheckIn().isAfter(upcomingCutoff))
                .count();

        // Recent bookings — last 5 created
        List<DashboardStatsResponse.RecentBookingItem> recentBookings =
                bookingRepository.findAll()
                        .stream()
                        .filter(b -> b.getStatus() != BookingStatus.cancelled)
                        .sorted((a, b) -> {
                            if (a.getCreatedAt() == null) return 1;
                            if (b.getCreatedAt() == null) return -1;
                            return b.getCreatedAt().compareTo(a.getCreatedAt());
                        })
                        .limit(5)
                        .map(b -> DashboardStatsResponse.RecentBookingItem.builder()
                                .bookingReference(b.getBookingReference())
                                .guestName(b.getGuest().getFullName())
                                .roomName(b.getRoom().getName())
                                .checkIn(b.getCheckIn().toString())
                                .checkOut(b.getCheckOut().toString())
                                .status(b.getStatus().name())
                                .build())
                        .toList();

        return DashboardStatsResponse.builder()
                .arrivalsToday(arrivalsToday)
                .departuresToday(departuresToday)
                .occupiedRooms(occupiedRooms)
                .totalRooms(totalRooms)
                .upcomingBookings(upcomingBookings)
                .recentBookings(recentBookings)
                .build();
    }
}
