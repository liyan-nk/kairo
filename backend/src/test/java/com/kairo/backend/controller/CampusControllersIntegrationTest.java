package com.kairo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kairo.backend.dto.request.ClaimRequest;
import com.kairo.backend.dto.request.CreateLostFoundRequest;
import com.kairo.backend.dto.request.CreateProxyReportRequest;
import com.kairo.backend.entity.*;
import com.kairo.backend.repository.*;
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
import java.time.LocalTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
public class CampusControllersIntegrationTest {

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
    private AcademicTermRepository termRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private TimetableSlotRepository slotRepository;

    @Autowired
    private ProxyReportRepository proxyReportRepository;

    @Autowired
    private LostFoundItemRepository lostFoundItemRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private UserEntity testUser;
    private String jwtToken;
    private TimetableSlotEntity testSlot;

    @BeforeEach
    void setUp() {
        lostFoundItemRepository.deleteAll();
        proxyReportRepository.deleteAll();
        slotRepository.deleteAll();
        enrollmentRepository.deleteAll();
        courseRepository.deleteAll();
        termRepository.deleteAll();
        userRepository.deleteAll();

        // Setup test student
        testUser = UserEntity.builder()
                .name("Campus Test Student")
                .email("campus_test@example.com")
                .passwordHash("hashed_password_123")
                .build();
        testUser = userRepository.save(testUser);
        jwtToken = "Bearer " + jwtTokenProvider.generateTokenFromUserId(testUser.getId(), testUser.getEmail());

        // Setup course & slots
        AcademicTermEntity term = AcademicTermEntity.builder()
                .code("T2026")
                .name("Term 2026")
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusDays(50))
                .isActive(true)
                .build();
        term = termRepository.save(term);

        CourseEntity course = CourseEntity.builder()
                .termId(term.getId())
                .code("CS202")
                .name("Operating Systems")
                .room("Room 102")
                .faculty("Prof. Verma")
                .build();
        course = courseRepository.save(course);

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .userId(testUser.getId())
                .courseId(course.getId())
                .build();
        enrollment = enrollmentRepository.save(enrollment);

        testSlot = TimetableSlotEntity.builder()
                .enrollmentId(enrollment.getId())
                .dayOfWeek(DayOfWeekEnum.MON)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(10, 0))
                .subjectName("Operating Systems")
                .isBreak(false)
                .build();
        testSlot = slotRepository.save(testSlot);
    }

    @Test
    @DisplayName("Should submit discrepancy report via POST /api/v1/campus/proxy-reports")
    void submitProxyReport_Success() throws Exception {
        CreateProxyReportRequest request = CreateProxyReportRequest.builder()
                .timetableSlotId(testSlot.getId())
                .actualSubject("Database Systems")
                .room("Room 105")
                .faculty("Dr. Sharma")
                .date(LocalDate.now())
                .build();

        mockMvc.perform(post("/api/v1/campus/proxy-reports")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.actualSubject").value("Database Systems"))
                .andExpect(jsonPath("$.reportCount").value(1))
                .andExpect(jsonPath("$.status").value("Pending"));
    }

    @Test
    @DisplayName("Should log and claim lost item via POST and PATCH Lost & Found APIs")
    void lostFound_Lifecycle_Success() throws Exception {
        CreateLostFoundRequest request = CreateLostFoundRequest.builder()
                .title("Scientific Calculator")
                .description("fx-991")
                .category("Electronics")
                .location("Room 304")
                .date(LocalDate.now())
                .question("What color?")
                .answer("blue")
                .contactInfo("Prof. Verma")
                .build();

        // 1. Submit item
        String responseContent = mockMvc.perform(post("/api/v1/campus/lost-found")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Scientific Calculator"))
                .andExpect(jsonPath("$.status").value("Lost"))
                .andReturn().getResponse().getContentAsString();

        UUID itemId = UUID.fromString(objectMapper.readTree(responseContent).get("id").asText());

        // 2. List items
        mockMvc.perform(get("/api/v1/campus/lost-found")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Scientific Calculator"));

        // 3. Claim item with correct answer
        ClaimRequest claimRequest = new ClaimRequest("   BLUE   ");
        mockMvc.perform(patch("/api/v1/campus/lost-found/" + itemId + "/claim")
                        .header("Authorization", jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(claimRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Claimed"));
    }
}
