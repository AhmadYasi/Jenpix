package com.villaelbling.backend.repository;

import com.villaelbling.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByTableNameAndRecordIdOrderByCreatedAtDesc(String tableName, UUID recordId);

    List<AuditLog> findByTableNameOrderByCreatedAtDesc(String tableName);
}
