package com.villaelbling.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "action", nullable = false)
    @ColumnTransformer(write = "?::audit_action")
    private AuditAction action;

    @Column(name = "table_name", nullable = false, length = 50)
    private String tableName;

    @Column(name = "record_id")
    private UUID recordId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_values", columnDefinition = "jsonb")
    private Map<String, Object> oldValues;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_values", columnDefinition = "jsonb")
    private Map<String, Object> newValues;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(name = "ip_address", columnDefinition = "inet", insertable = false, updatable = false)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
