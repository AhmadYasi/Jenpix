package com.villaelbling.backend.repository;

import com.villaelbling.backend.entity.BlockedDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BlockedDateRepository extends JpaRepository<BlockedDate, UUID> {


    @Query("""
            SELECT bd FROM BlockedDate bd
            WHERE bd.room.id = :roomId
              AND bd.startDate < :windowEnd
              AND bd.endDate > :windowStart
            """)
    List<BlockedDate> findByRoomInWindow(
            @Param("roomId") UUID roomId,
            @Param("windowStart") LocalDate windowStart,
            @Param("windowEnd") LocalDate windowEnd);


    @Query("""
            SELECT CASE WHEN COUNT(bd) > 0 THEN true ELSE false END
            FROM BlockedDate bd
            WHERE bd.room.id = :roomId
              AND bd.startDate < :checkOut
              AND bd.endDate > :checkIn
            """)
    boolean existsOverlapForRoom(
            @Param("roomId") UUID roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);


    @Query("""
            SELECT bd FROM BlockedDate bd
            WHERE bd.startDate < :windowEnd
              AND bd.endDate > :windowStart
            ORDER BY bd.startDate
            """)
    List<BlockedDate> findAllInWindow(
            @Param("windowStart") LocalDate windowStart,
            @Param("windowEnd") LocalDate windowEnd);

    List<BlockedDate> findByRoom_Id(UUID roomId);
}
