package com.kairo.backend.service;

import com.kairo.backend.dto.request.LoginRequest;
import com.kairo.backend.dto.request.RefreshTokenRequest;
import com.kairo.backend.dto.request.SignupRequest;
import com.kairo.backend.dto.response.AuthResponse;
import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.UnauthorizedException;
import com.kairo.backend.mapper.UserMapper;
import com.kairo.backend.repository.RefreshTokenRepository;
import com.kairo.backend.repository.UserRepository;
import com.kairo.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private UserMapper userMapper;
    private TokenService tokenService;
    private AuthService authService;

    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
        String testSecret = "testSecretKeyForKairoJwtTokenAuthenticationMustBeLongEnough64BytesLongHere!";
        JwtTokenProvider tokenProvider = new JwtTokenProvider(testSecret, 900000L);
        tokenService = new TokenService(tokenProvider, refreshTokenRepository);
        ReflectionTestUtils.setField(tokenService, "refreshExpirationMs", 604800000L);

        authService = new AuthService(
                userRepository,
                refreshTokenRepository,
                tokenService,
                passwordEncoder,
                authenticationManager,
                userMapper
        );
    }

    @Test
    @DisplayName("signup should throw DuplicateResourceException when email exists")
    void signup_DuplicateEmail_ThrowsException() {
        SignupRequest request = SignupRequest.builder()
                .name("Test User")
                .email("existing@example.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmailAndDeletedAtIsNull("existing@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.signup(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("signup should create user and return tokens when valid")
    void signup_Success() {
        SignupRequest request = SignupRequest.builder()
                .name("New User")
                .email("new@example.com")
                .password("Password123!")
                .build();

        UserEntity savedUser = UserEntity.builder()
                .id(userId)
                .name("New User")
                .email("new@example.com")
                .passwordHash("hashed_password")
                .build();

        when(userRepository.existsByEmailAndDeletedAtIsNull("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed_password");
        when(userRepository.save(any(UserEntity.class))).thenReturn(savedUser);

        AuthResponse response = authService.signup(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("new@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("login should throw UnauthorizedException on bad credentials")
    void login_BadCredentials_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("wrong_password")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("login should return AuthResponse on valid credentials")
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123!")
                .build();

        UserEntity user = UserEntity.builder()
                .id(userId)
                .email("test@example.com")
                .build();

        when(userRepository.findByEmailAndDeletedAtIsNull("test@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("test@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("logout should revoke refresh token")
    void logout_Success() {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("token_to_logout")
                .build();

        authService.logout(request);

        verify(refreshTokenRepository).findByTokenHash(anyString());
    }
}
