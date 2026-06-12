package com.villaelbling.backend.repository;

import com.villaelbling.backend.entity.Booking;
import com.villaelbling.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByGuest_Id(UUID guestId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByRoom_IdOrderByCheckInAsc(UUID roomId);
    @Query("SELECT b FROM Booking b WHERE b.checkIn = :date")
    List<Booking> findByCheckInOn(@Param("date") LocalDate date);
    @Query("SELECT b FROM Booking b WHERE b.checkOut = :date")
    List<Booking> findByCheckOutOn(@Param("date") LocalDate date);
    @Query("SELECT b FROM Booking b WHERE b.checkIn >= :from ORDER BY b.checkIn ASC")
    List<Booking> findUpcomingFrom(@Param("from") LocalDate from);

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.room.id = :roomId
              AND b.status != :cancelledStatus
              AND b.checkIn < :checkOut
              AND b.checkOut > :checkIn
            """)
    boolean existsOverlappingBooking(
            @Param("roomId") UUID roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("cancelledStatus") BookingStatus cancelledStatus);
}
