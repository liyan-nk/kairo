package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "proxy_report_votes")
public class ProxyReportVoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "proxy_report_id", nullable = false)
    private UUID proxyReportId;

    @Column(name = "voter_id", nullable = false)
    private UUID voterId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ProxyReportVoteEntity() {
    }

    public ProxyReportVoteEntity(UUID id, UUID proxyReportId, UUID voterId, Instant createdAt) {
        this.id = id;
        this.proxyReportId = proxyReportId;
        this.voterId = voterId;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProxyReportId() { return proxyReportId; }
    public void setProxyReportId(UUID proxyReportId) { this.proxyReportId = proxyReportId; }

    public UUID getVoterId() { return voterId; }
    public void setVoterId(UUID voterId) { this.voterId = voterId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static ProxyReportVoteEntityBuilder builder() {
        return new ProxyReportVoteEntityBuilder();
    }

    public static class ProxyReportVoteEntityBuilder {
        private UUID id;
        private UUID proxyReportId;
        private UUID voterId;
        private Instant createdAt = Instant.now();

        public ProxyReportVoteEntityBuilder id(UUID id) { this.id = id; return this; }
        public ProxyReportVoteEntityBuilder proxyReportId(UUID proxyReportId) { this.proxyReportId = proxyReportId; return this; }
        public ProxyReportVoteEntityBuilder voterId(UUID voterId) { this.voterId = voterId; return this; }
        public ProxyReportVoteEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public ProxyReportVoteEntity build() {
            return new ProxyReportVoteEntity(id, proxyReportId, voterId, createdAt);
        }
    }
}
