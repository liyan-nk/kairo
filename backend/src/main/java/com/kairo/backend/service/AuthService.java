package com.kairo.backend.service;

import com.kairo.backend.dto.request.LoginRequest;
import com.kairo.backend.dto.request.RefreshTokenRequest;
import com.kairo.backend.dto.request.SignupRequest;
import com.kairo.backend.dto.response.AuthResponse;
import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.RefreshTokenEntity;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.entity.UserRole;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.UnauthorizedException;
import com.kairo.backend.mapper.UserMapper;
import com.kairo.backend.repository.RefreshTokenRepository;
import com.kairo.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        UserEntity user = UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(UserRole.ROLE_STUDENT))
                .build();

        UserEntity savedUser = userRepository.save(user);

        String accessToken = tokenService.createAccessToken(savedUser);
        String refreshToken = tokenService.createRefreshToken(savedUser.getId());
        UserProfileResponse userProfile = userMapper.toUserProfileResponse(savedUser);

        return AuthResponse.builder()
                .user(userProfile)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserEntity user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        String accessToken = tokenService.createAccessToken(user);
        String refreshToken = tokenService.createRefreshToken(user.getId());
        UserProfileResponse userProfile = userMapper.toUserProfileResponse(user);

        return AuthResponse.builder()
                .user(userProfile)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String tokenHash = tokenService.hashToken(request.getRefreshToken());
        RefreshTokenEntity existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        UserEntity user = userRepository.findById(existingToken.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User not found for refresh token"));

        UserProfileResponse userProfile = userMapper.toUserProfileResponse(user);
        return tokenService.rotateRefreshToken(request.getRefreshToken(), user, userProfile);
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        tokenService.revokeRefreshToken(request.getRefreshToken());
    }
}
