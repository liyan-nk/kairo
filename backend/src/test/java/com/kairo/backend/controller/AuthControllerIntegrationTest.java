package com.kairo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairo.backend.dto.request.LoginRequest;
import com.kairo.backend.dto.request.RefreshTokenRequest;
import com.kairo.backend.dto.request.SignupRequest;
import com.kairo.backend.dto.response.AuthResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should register new user successfully")
    void signup_Success() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Integration User")
                .email("signup_test@example.com")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.email").value("signup_test@example.com"))
                .andExpect(jsonPath("$.user.name").value("Integration User"))
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }

    @Test
    @DisplayName("Should return 409 Conflict when signing up with existing email")
    void signup_DuplicateEmail_ReturnsConflict() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Duplicate User")
                .email("duplicate_test@example.com")
                .password("Password123!")
                .build();

        // First registration
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated());

        // Duplicate registration
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Email already registered: duplicate_test@example.com"));
    }

    @Test
    @DisplayName("Should authenticate user with valid credentials")
    void login_Success() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Login User")
                .email("login_test@example.com")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = LoginRequest.builder()
                .email("login_test@example.com")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("login_test@example.com"))
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for bad credentials")
    void login_BadCredentials_ReturnsUnauthorized() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("nonexistent@example.com")
                .password("WrongPassword123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("Should rotate refresh token and issue new token pair")
    void refreshToken_Success() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Refresh User")
                .email("refresh_test@example.com")
                .password("Password123!")
                .build();

        MvcResult signupResult = mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(signupResult.getResponse().getContentAsString(), AuthResponse.class);
        String initialRefreshToken = authResponse.getRefreshToken();

        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken(initialRefreshToken)
                .build();

        MvcResult refreshResult = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andReturn();

        AuthResponse rotatedResponse = objectMapper.readValue(refreshResult.getResponse().getContentAsString(), AuthResponse.class);
        assertNotEquals(initialRefreshToken, rotatedResponse.getRefreshToken());
    }

    @Test
    @DisplayName("Should trigger token family invalidation when reusing revoked refresh token")
    void refreshToken_RevokedTokenReuse_TriggersFamilyInvalidation() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Reuse User")
                .email("reuse_test@example.com")
                .password("Password123!")
                .build();

        MvcResult signupResult = mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(signupResult.getResponse().getContentAsString(), AuthResponse.class);
        String initialRefreshToken = authResponse.getRefreshToken();

        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken(initialRefreshToken)
                .build();

        // First rotation (valid)
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk());

        // Second rotation using initial (now revoked) token -> triggers reuse detection & family invalidation
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Revoked refresh token reuse detected. All active sessions invalidated."));
    }

    @Test
    @DisplayName("Should logout user and revoke refresh token")
    void logout_Success() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .name("Logout User")
                .email("logout_test@example.com")
                .password("Password123!")
                .build();

        MvcResult signupResult = mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(signupResult.getResponse().getContentAsString(), AuthResponse.class);
        String refreshToken = authResponse.getRefreshToken();

        RefreshTokenRequest logoutRequest = RefreshTokenRequest.builder()
                .refreshToken(refreshToken)
                .build();

        // Logout
        mockMvc.perform(post("/api/v1/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isNoContent());

        // Subsequent refresh should fail
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isUnauthorized());
    }
}
