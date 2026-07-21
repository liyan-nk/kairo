package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RefreshTokenEntity() {
    }

    public RefreshTokenEntity(UUID id, UUID userId, String tokenHash, Instant expiresAt, boolean revoked, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static RefreshTokenEntityBuilder builder() {
        return new RefreshTokenEntityBuilder();
    }

    public static class RefreshTokenEntityBuilder {
        private UUID id;
        private UUID userId;
        private String tokenHash;
        private Instant expiresAt;
        private boolean revoked = false;
        private Instant createdAt = Instant.now();

        public RefreshTokenEntityBuilder id(UUID id) { this.id = id; return this; }
        public RefreshTokenEntityBuilder userId(UUID userId) { this.userId = userId; return this; }
        public RefreshTokenEntityBuilder tokenHash(String tokenHash) { this.tokenHash = tokenHash; return this; }
        public RefreshTokenEntityBuilder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public RefreshTokenEntityBuilder revoked(boolean revoked) { this.revoked = revoked; return this; }
        public RefreshTokenEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public RefreshTokenEntity build() {
            return new RefreshTokenEntity(id, userId, tokenHash, expiresAt, revoked, createdAt);
        }
    }
}
