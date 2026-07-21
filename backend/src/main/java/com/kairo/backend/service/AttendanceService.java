package com.kairo.backend.service;

import com.kairo.backend.dto.request.MarkAttendanceRequest;
import com.kairo.backend.dto.request.UpdateAttendanceRequest;
import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.entity.AttendanceLogEntity;
import com.kairo.backend.entity.AttendanceStatusEnum;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.mapper.AttendanceMapper;
import com.kairo.backend.repository.AttendanceLogRepository;
import com.kairo.backend.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AttendanceService(
            AttendanceLogRepository attendanceLogRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.attendanceLogRepository = attendanceLogRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public AttendanceLogResponse markAttendance(UUID userId, MarkAttendanceRequest request) {
        EnrollmentEntity enrollment = enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course enrollment not found for course: " + request.getCourseId()));

        if (request.getSlotId() != null) {
            attendanceLogRepository.findByUserIdAndTimetableSlotIdAndLogDateAndDeletedAtIsNull(userId, request.getSlotId(), request.getDate())
                    .ifPresent(existing -> {
                        throw new DuplicateResourceException("Attendance record already exists for date " + request.getDate() + " and slot " + request.getSlotId());
                    });
        }

        AttendanceLogEntity log = AttendanceLogEntity.builder()
                .userId(userId)
                .enrollmentId(enrollment.getId())
                .timetableSlotId(request.getSlotId())
                .logDate(request.getDate())
                .status(request.getStatus())
                .notes(request.getNotes())
                .build();

        AttendanceLogEntity savedLog = attendanceLogRepository.save(log);

        // Recalculate enrollment counters transactionally
        enrollment.setTotalClasses(enrollment.getTotalClasses() + 1);
        if (request.getStatus() == AttendanceStatusEnum.PRESENT) {
            enrollment.setAttendedClasses(enrollment.getAttendedClasses() + 1);
        }
        enrollmentRepository.save(enrollment);

        return AttendanceMapper.toAttendanceLogResponse(savedLog);
    }

    @Transactional
    public AttendanceLogResponse updateAttendance(UUID userId, UUID logId, UpdateAttendanceRequest request) {
        AttendanceLogEntity log = attendanceLogRepository.findByIdAndUserIdAndDeletedAtIsNull(logId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance log not found: " + logId));

        EnrollmentEntity enrollment = enrollmentRepository.findByIdAndDeletedAtIsNull(log.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for log: " + logId));

        AttendanceStatusEnum previousStatus = log.getStatus();
        AttendanceStatusEnum newStatus = request.getStatus();

        if (previousStatus != newStatus) {
            if (previousStatus == AttendanceStatusEnum.PRESENT && newStatus == AttendanceStatusEnum.ABSENT) {
                enrollment.setAttendedClasses(Math.max(0, enrollment.getAttendedClasses() - 1));
            } else if (previousStatus == AttendanceStatusEnum.ABSENT && newStatus == AttendanceStatusEnum.PRESENT) {
                enrollment.setAttendedClasses(enrollment.getAttendedClasses() + 1);
            }
            enrollmentRepository.save(enrollment);
        }

        log.setStatus(newStatus);
        if (request.getNotes() != null) {
            log.setNotes(request.getNotes());
        }

        AttendanceLogEntity updatedLog = attendanceLogRepository.save(log);
        return AttendanceMapper.toAttendanceLogResponse(updatedLog);
    }

    @Transactional(readOnly = true)
    public List<AttendanceLogResponse> getCourseAttendanceLogs(UUID userId, UUID courseId) {
        EnrollmentEntity enrollment = enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course enrollment not found for course: " + courseId));

        List<AttendanceLogEntity> logs = attendanceLogRepository
                .findAllByUserIdAndEnrollmentIdAndDeletedAtIsNullOrderByLogDateDescCreatedAtDesc(userId, enrollment.getId());

        return logs.stream()
                .map(AttendanceMapper::toAttendanceLogResponse)
                .toList();
    }

    @Transactional
    public void deleteAttendance(UUID userId, UUID logId) {
        AttendanceLogEntity log = attendanceLogRepository.findByIdAndUserIdAndDeletedAtIsNull(logId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance log not found: " + logId));

        EnrollmentEntity enrollment = enrollmentRepository.findByIdAndDeletedAtIsNull(log.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for log: " + logId));

        enrollment.setTotalClasses(Math.max(0, enrollment.getTotalClasses() - 1));
        if (log.getStatus() == AttendanceStatusEnum.PRESENT) {
            enrollment.setAttendedClasses(Math.max(0, enrollment.getAttendedClasses() - 1));
        }
        enrollmentRepository.save(enrollment);

        log.setDeletedAt(java.time.Instant.now());
        attendanceLogRepository.save(log);
    }
}
