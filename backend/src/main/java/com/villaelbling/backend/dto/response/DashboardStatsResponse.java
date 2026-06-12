package com.villaelbling.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {

    private int arrivalsToday;
    private int departuresToday;
    private int occupiedRooms;
    private int totalRooms;
    private int upcomingBookings;
    private List<RecentBookingItem> recentBookings;

    @Data
    @Builder
    public static class RecentBookingItem {
        private String bookingReference;
        private String guestName;
        private String roomName;
        private String checkIn;
        private String checkOut;
        private String status;
    }
}
