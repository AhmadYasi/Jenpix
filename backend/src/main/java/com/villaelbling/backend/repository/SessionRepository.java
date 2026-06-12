package com.villaelbling.backend.repository;

import com.villaelbling.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByToken(String token);

    @Transactional
    void deleteByUser_Id(UUID userId);   // logout: invalidate all sessions for a user

    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime now);

    @Query("SELECT s FROM Session s JOIN FETCH s.user WHERE s.token = :token")
    Optional<Session> findByTokenWithUser(@Param("token") String token);
}
