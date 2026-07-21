package com.kairo.backend.service;

import com.kairo.backend.dto.request.MarkAttendanceRequest;
import com.kairo.backend.dto.request.UpdateAttendanceRequest;
import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.entity.AttendanceLogEntity;
import com.kairo.backend.entity.AttendanceStatusEnum;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.repository.AttendanceLogRepository;
import com.kairo.backend.repository.EnrollmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AttendanceServiceUnitTest {

    @Mock
    private AttendanceLogRepository attendanceLogRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    private AttendanceService attendanceService;

    private final UUID userId = UUID.randomUUID();
    private final UUID courseId = UUID.randomUUID();
    private final UUID slotId = UUID.randomUUID();
    private final UUID enrollmentId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        attendanceService = new AttendanceService(attendanceLogRepository, enrollmentRepository);
    }

    @Test
    @DisplayName("markAttendance should increment enrollment counters and persist log")
    void markAttendance_Success() {
        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .id(enrollmentId)
                .userId(userId)
                .courseId(courseId)
                .attendedClasses(5)
                .totalClasses(10)
                .build();

        MarkAttendanceRequest request = MarkAttendanceRequest.builder()
                .courseId(courseId)
                .slotId(slotId)
                .date(LocalDate.now())
                .status(AttendanceStatusEnum.PRESENT)
                .notes("On time")
                .build();

        AttendanceLogEntity savedLog = AttendanceLogEntity.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .enrollmentId(enrollmentId)
                .timetableSlotId(slotId)
                .logDate(LocalDate.now())
                .status(AttendanceStatusEnum.PRESENT)
                .notes("On time")
                .build();

        when(enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)).thenReturn(Optional.of(enrollment));
        when(attendanceLogRepository.findByUserIdAndTimetableSlotIdAndLogDateAndDeletedAtIsNull(userId, slotId, request.getDate())).thenReturn(Optional.empty());
        when(attendanceLogRepository.save(any(AttendanceLogEntity.class))).thenReturn(savedLog);

        AttendanceLogResponse response = attendanceService.markAttendance(userId, request);

        assertNotNull(response);
        assertEquals(AttendanceStatusEnum.PRESENT, response.getStatus());
        assertEquals(6, enrollment.getAttendedClasses());
        assertEquals(11, enrollment.getTotalClasses());
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    @DisplayName("markAttendance should throw DuplicateResourceException when slot/date log already exists")
    void markAttendance_Duplicate_ThrowsException() {
        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .id(enrollmentId)
                .userId(userId)
                .courseId(courseId)
                .build();

        MarkAttendanceRequest request = MarkAttendanceRequest.builder()
                .courseId(courseId)
                .slotId(slotId)
                .date(LocalDate.now())
                .status(AttendanceStatusEnum.PRESENT)
                .build();

        AttendanceLogEntity existingLog = AttendanceLogEntity.builder().id(UUID.randomUUID()).build();

        when(enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)).thenReturn(Optional.of(enrollment));
        when(attendanceLogRepository.findByUserIdAndTimetableSlotIdAndLogDateAndDeletedAtIsNull(userId, slotId, request.getDate()))
                .thenReturn(Optional.of(existingLog));

        assertThrows(DuplicateResourceException.class, () -> attendanceService.markAttendance(userId, request));
        verify(attendanceLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateAttendance should adjust attendedClasses when status changes from PRESENT to ABSENT")
    void updateAttendance_StatusChanged_RecalculatesCounters() {
        UUID logId = UUID.randomUUID();

        AttendanceLogEntity log = AttendanceLogEntity.builder()
                .id(logId)
                .userId(userId)
                .enrollmentId(enrollmentId)
                .status(AttendanceStatusEnum.PRESENT)
                .build();

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .id(enrollmentId)
                .attendedClasses(8)
                .totalClasses(10)
                .build();

        UpdateAttendanceRequest request = UpdateAttendanceRequest.builder()
                .status(AttendanceStatusEnum.ABSENT)
                .notes("Sick leave")
                .build();

        when(attendanceLogRepository.findByIdAndUserIdAndDeletedAtIsNull(logId, userId)).thenReturn(Optional.of(log));
        when(enrollmentRepository.findByIdAndDeletedAtIsNull(enrollmentId)).thenReturn(Optional.of(enrollment));
        when(attendanceLogRepository.save(log)).thenReturn(log);

        AttendanceLogResponse response = attendanceService.updateAttendance(userId, logId, request);

        assertEquals(AttendanceStatusEnum.ABSENT, response.getStatus());
        assertEquals(7, enrollment.getAttendedClasses());
        assertEquals(10, enrollment.getTotalClasses());
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    @DisplayName("deleteAttendance should decrement counters and set deletedAt timestamp")
    void deleteAttendance_Success() {
        UUID logId = UUID.randomUUID();

        AttendanceLogEntity log = AttendanceLogEntity.builder()
                .id(logId)
                .userId(userId)
                .enrollmentId(enrollmentId)
                .status(AttendanceStatusEnum.PRESENT)
                .build();

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .id(enrollmentId)
                .attendedClasses(5)
                .totalClasses(10)
                .build();

        when(attendanceLogRepository.findByIdAndUserIdAndDeletedAtIsNull(logId, userId)).thenReturn(Optional.of(log));
        when(enrollmentRepository.findByIdAndDeletedAtIsNull(enrollmentId)).thenReturn(Optional.of(enrollment));

        attendanceService.deleteAttendance(userId, logId);

        assertEquals(4, enrollment.getAttendedClasses());
        assertEquals(9, enrollment.getTotalClasses());
        assertNotNull(log.getDeletedAt());
        verify(enrollmentRepository).save(enrollment);
        verify(attendanceLogRepository).save(log);
    }
}
