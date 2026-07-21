package com.kairo.backend.service;

import com.kairo.backend.dto.response.CourseDetailResponse;
import com.kairo.backend.dto.response.CourseResponse;
import com.kairo.backend.entity.CourseEntity;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.entity.OfficialBaselineEntity;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.repository.AttendanceLogRepository;
import com.kairo.backend.repository.EnrollmentRepository;
import com.kairo.backend.repository.OfficialBaselineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SubjectServiceUnitTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private OfficialBaselineRepository baselineRepository;

    @Mock
    private AttendanceLogRepository attendanceLogRepository;

    private SubjectService subjectService;

    private final UUID userId = UUID.randomUUID();
    private final UUID courseId = UUID.randomUUID();
    private final UUID enrollmentId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        subjectService = new SubjectService(enrollmentRepository, baselineRepository, attendanceLogRepository);
    }

    @Test
    @DisplayName("getEnrolledCourses should map enrollments and calculate attendance metrics")
    void getEnrolledCourses_Success() {
        CourseEntity course = CourseEntity.builder()
                .id(courseId)
                .code("CS101")
                .name("Data Structures")
                .faculty("Dr. Alan")
                .room("Lab 3")
                .build();

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .id(enrollmentId)
                .userId(userId)
                .courseId(courseId)
                .course(course)
                .attendedClasses(16)
                .totalClasses(20)
                .build();

        OfficialBaselineEntity baseline = OfficialBaselineEntity.builder()
                .enrollmentId(enrollmentId)
                .baselinePercentage(new BigDecimal("78.50"))
                .publishedDate(LocalDate.now())
                .build();

        when(enrollmentRepository.findByUserIdAndDeletedAtIsNull(userId)).thenReturn(List.of(enrollment));
        when(baselineRepository.findAllByEnrollmentIdIn(List.of(enrollmentId))).thenReturn(List.of(baseline));

        List<CourseResponse> response = subjectService.getEnrolledCourses(userId);

        assertEquals(1, response.size());
        CourseResponse courseRes = response.get(0);
        assertEquals("CS101", courseRes.getCode());
        assertEquals(80.0, courseRes.getPercentage());
        assertEquals("ON_TRACK", courseRes.getStatus());
        assertEquals(78.50, courseRes.getBaselinePercentage());
        assertEquals(1, courseRes.getCanSkipClasses());
        assertEquals(0, courseRes.getMustAttendClasses());
    }

    @Test
    @DisplayName("getCourseDetail should throw ResourceNotFoundException when enrollment missing")
    void getCourseDetail_NotFound_ThrowsException() {
        when(enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> subjectService.getCourseDetail(userId, courseId));
    }

    @Test
    @DisplayName("calculateCanSkip and calculateMustAttend math verification")
    void calculateMath_Verification() {
        assertEquals(1, subjectService.calculateCanSkip(16, 20, 0.75));
        assertEquals(0, subjectService.calculateMustAttend(16, 20, 0.75));

        assertEquals(0, subjectService.calculateCanSkip(10, 20, 0.75));
        assertEquals(20, subjectService.calculateMustAttend(10, 20, 0.75));
    }
}
