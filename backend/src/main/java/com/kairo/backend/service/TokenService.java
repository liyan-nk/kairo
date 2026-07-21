package com.kairo.backend.service;

import com.kairo.backend.dto.response.AuthResponse;
import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.RefreshTokenEntity;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.exception.UnauthorizedException;
import com.kairo.backend.repository.RefreshTokenRepository;
import com.kairo.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${kairo.security.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public TokenService(JwtTokenProvider jwtTokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public String createAccessToken(UserEntity user) {
        return jwtTokenProvider.generateTokenFromUserId(user.getId(), user.getEmail());
    }

    @Transactional
    public String createRefreshToken(UUID userId) {
        String rawToken = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawToken);

        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .userId(userId)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Transactional
    public AuthResponse rotateRefreshToken(String rawRefreshToken, UserEntity user, UserProfileResponse userProfile) {
        String tokenHash = hashToken(rawRefreshToken);
        RefreshTokenEntity existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        // Reuse detection & Token Family Invalidation
        if (existingToken.isRevoked()) {
            refreshTokenRepository.deleteByUserId(existingToken.getUserId());
            throw new UnauthorizedException("Revoked refresh token reuse detected. All active sessions invalidated.");
        }

        if (existingToken.getExpiresAt().isBefore(Instant.now())) {
            existingToken.setRevoked(true);
            refreshTokenRepository.save(existingToken);
            throw new UnauthorizedException("Refresh token expired. Please log in again.");
        }

        // Revoke old token
        existingToken.setRevoked(true);
        refreshTokenRepository.save(existingToken);

        // Issue new token pair
        String newAccessToken = createAccessToken(user);
        String newRefreshToken = createRefreshToken(user.getId());

        return AuthResponse.builder()
                .user(userProfile)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void revokeRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllUserTokens(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
