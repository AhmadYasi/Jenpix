package com.villaelbling.backend.repository;

import com.villaelbling.backend.entity.BookingStatus;
import com.villaelbling.backend.entity.Room;
import com.villaelbling.backend.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {

    Optional<Room> findByRoomNumber(Integer roomNumber);

    List<Room> findByStatus(RoomStatus status);   // pass RoomStatus.active at call site

    @Query("""
            SELECT r FROM Room r
            WHERE r.status = 'active'
              AND r.maxGuests >= :guestCount
              AND r.id NOT IN (
                  SELECT b.room.id FROM Booking b
                  WHERE b.status != :cancelledStatus
                    AND b.checkIn < :checkOut
                    AND b.checkOut > :checkIn
              )
              AND r.id NOT IN (
                  SELECT bd.room.id FROM BlockedDate bd
                  WHERE bd.startDate < :checkOut
                    AND bd.endDate > :checkIn
              )
            ORDER BY r.roomNumber
            """)
    List<Room> findAvailableRooms(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("guestCount") Integer guestCount,
            @Param("cancelledStatus") BookingStatus cancelledStatus);
}
