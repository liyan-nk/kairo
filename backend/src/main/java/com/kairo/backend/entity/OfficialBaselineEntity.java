package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "official_baselines")
public class OfficialBaselineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "enrollment_id", nullable = false)
    private UUID enrollmentId;

    @Column(name = "baseline_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal baselinePercentage;

    @Column(name = "published_date", nullable = false)
    private LocalDate publishedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public OfficialBaselineEntity() {
    }

    public OfficialBaselineEntity(UUID id, UUID enrollmentId, BigDecimal baselinePercentage, LocalDate publishedDate, Instant createdAt) {
        this.id = id;
        this.enrollmentId = enrollmentId;
        this.baselinePercentage = baselinePercentage;
        this.publishedDate = publishedDate;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; }

    public BigDecimal getBaselinePercentage() { return baselinePercentage; }
    public void setBaselinePercentage(BigDecimal baselinePercentage) { this.baselinePercentage = baselinePercentage; }

    public LocalDate getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDate publishedDate) { this.publishedDate = publishedDate; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static OfficialBaselineEntityBuilder builder() {
        return new OfficialBaselineEntityBuilder();
    }

    public static class OfficialBaselineEntityBuilder {
        private UUID id;
        private UUID enrollmentId;
        private BigDecimal baselinePercentage;
        private LocalDate publishedDate;
        private Instant createdAt = Instant.now();

        public OfficialBaselineEntityBuilder id(UUID id) { this.id = id; return this; }
        public OfficialBaselineEntityBuilder enrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; return this; }
        public OfficialBaselineEntityBuilder baselinePercentage(BigDecimal baselinePercentage) { this.baselinePercentage = baselinePercentage; return this; }
        public OfficialBaselineEntityBuilder publishedDate(LocalDate publishedDate) { this.publishedDate = publishedDate; return this; }
        public OfficialBaselineEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public OfficialBaselineEntity build() {
            return new OfficialBaselineEntity(id, enrollmentId, baselinePercentage, publishedDate, createdAt);
        }
    }
}
