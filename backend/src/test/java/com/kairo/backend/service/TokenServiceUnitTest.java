package com.kairo.backend.service;

import com.kairo.backend.dto.response.AuthResponse;
import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.RefreshTokenEntity;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.exception.UnauthorizedException;
import com.kairo.backend.repository.RefreshTokenRepository;
import com.kairo.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TokenServiceUnitTest {

    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private TokenService tokenService;

    private final UUID userId = UUID.randomUUID();
    private final String userEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        String testSecret = "testSecretKeyForKairoJwtTokenAuthenticationMustBeLongEnough64BytesLongHere!";
        jwtTokenProvider = new JwtTokenProvider(testSecret, 900000L);
        tokenService = new TokenService(jwtTokenProvider, refreshTokenRepository);
        ReflectionTestUtils.setField(tokenService, "refreshExpirationMs", 604800000L);
    }

    @Test
    @DisplayName("createAccessToken should generate valid JWT token containing user ID")
    void createAccessToken_Success() {
        UserEntity user = UserEntity.builder()
                .id(userId)
                .email(userEmail)
                .build();

        String token = tokenService.createAccessToken(user);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(userId, jwtTokenProvider.getUserIdFromJWT(token));
    }

    @Test
    @DisplayName("createRefreshToken should generate raw token and persist hashed token entity")
    void createRefreshToken_Success() {
        String rawToken = tokenService.createRefreshToken(userId);

        assertNotNull(rawToken);
        ArgumentCaptor<RefreshTokenEntity> captor = ArgumentCaptor.forClass(RefreshTokenEntity.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshTokenEntity savedEntity = captor.getValue();
        assertEquals(userId, savedEntity.getUserId());
        assertFalse(savedEntity.isRevoked());
        assertEquals(tokenService.hashToken(rawToken), savedEntity.getTokenHash());
    }

    @Test
    @DisplayName("rotateRefreshToken should revoke old token and issue new token pair")
    void rotateRefreshToken_Success() {
        String rawToken = UUID.randomUUID().toString();
        String hashedToken = tokenService.hashToken(rawToken);

        RefreshTokenEntity existingEntity = RefreshTokenEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().plusSeconds(3600))
                .revoked(false)
                .build();

        UserEntity user = UserEntity.builder().id(userId).email(userEmail).build();
        UserProfileResponse profile = UserProfileResponse.builder().id(userId).email(userEmail).build();

        when(refreshTokenRepository.findByTokenHash(hashedToken)).thenReturn(Optional.of(existingEntity));

        AuthResponse response = tokenService.rotateRefreshToken(rawToken, user, profile);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertTrue(jwtTokenProvider.validateToken(response.getAccessToken()));
        assertTrue(existingEntity.isRevoked());
        verify(refreshTokenRepository, times(2)).save(any(RefreshTokenEntity.class));
    }

    @Test
    @DisplayName("rotateRefreshToken should trigger family invalidation when revoked token is reused")
    void rotateRefreshToken_RevokedReuse_TriggersFamilyInvalidation() {
        String rawToken = UUID.randomUUID().toString();
        String hashedToken = tokenService.hashToken(rawToken);

        RefreshTokenEntity revokedEntity = RefreshTokenEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().plusSeconds(3600))
                .revoked(true) // Revoked!
                .build();

        UserEntity user = UserEntity.builder().id(userId).email(userEmail).build();
        UserProfileResponse profile = UserProfileResponse.builder().id(userId).email(userEmail).build();

        when(refreshTokenRepository.findByTokenHash(hashedToken)).thenReturn(Optional.of(revokedEntity));

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () ->
                tokenService.rotateRefreshToken(rawToken, user, profile)
        );

        assertTrue(exception.getMessage().contains("Revoked refresh token reuse detected"));
        verify(refreshTokenRepository).deleteByUserId(userId);
    }

    @Test
    @DisplayName("rotateRefreshToken should throw UnauthorizedException when token is expired")
    void rotateRefreshToken_ExpiredToken_ThrowsUnauthorized() {
        String rawToken = UUID.randomUUID().toString();
        String hashedToken = tokenService.hashToken(rawToken);

        RefreshTokenEntity expiredEntity = RefreshTokenEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().minusSeconds(3600)) // Expired!
                .revoked(false)
                .build();

        UserEntity user = UserEntity.builder().id(userId).email(userEmail).build();
        UserProfileResponse profile = UserProfileResponse.builder().id(userId).email(userEmail).build();

        when(refreshTokenRepository.findByTokenHash(hashedToken)).thenReturn(Optional.of(expiredEntity));

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () ->
                tokenService.rotateRefreshToken(rawToken, user, profile)
        );

        assertTrue(exception.getMessage().contains("Refresh token expired"));
        assertTrue(expiredEntity.isRevoked());
        verify(refreshTokenRepository).save(expiredEntity);
    }
}
