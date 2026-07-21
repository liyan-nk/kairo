package com.kairo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairo.backend.dto.request.MarkAttendanceRequest;
import com.kairo.backend.dto.request.UpdateProfileRequest;
import com.kairo.backend.entity.AttendanceStatusEnum;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.repository.UserRepository;
import com.kairo.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
public class AcademicControllersIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private UserEntity testUser;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        testUser = UserEntity.builder()
                .name("Academic Test Student")
                .email("academic_test@example.com")
                .passwordHash("hashed_password_123")
                .rollNumber("21CS042")
                .department("Computer Science")
                .semester("6")
                .section("A")
                .build();

        testUser = userRepository.save(testUser);
        jwtToken = "Bearer " + jwtTokenProvider.generateTokenFromUserId(testUser.getId(), testUser.getEmail());
    }

    @Test
    @DisplayName("Should return current user profile via GET /api/v1/users/me")
    void getCurrentUser_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("academic_test@example.com"))
                .andExpect(jsonPath("$.rollNumber").value("21CS042"));
    }

    @Test
    @DisplayName("Should update user profile via PUT /api/v1/users/me")
    void updateCurrentUser_Success() throws Exception {
        UpdateProfileRequest updateRequest = UpdateProfileRequest.builder()
                .name("Updated Academic Student")
                .rollNumber("21CS099")
                .department("Information Technology")
                .semester("7")
                .section("B")
                .build();

        mockMvc.perform(put("/api/v1/users/me")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Academic Student"))
                .andExpect(jsonPath("$.rollNumber").value("21CS099"))
                .andExpect(jsonPath("$.department").value("Information Technology"));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for unauthenticated requests")
    void getToday_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/today"))
                .andExpect(status().isUnauthorized());
    }
}
