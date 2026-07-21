package com.kairo.backend.service;

import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.dto.response.CourseDetailResponse;
import com.kairo.backend.dto.response.CourseResponse;
import com.kairo.backend.entity.AttendanceLogEntity;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.entity.OfficialBaselineEntity;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.mapper.AttendanceMapper;
import com.kairo.backend.mapper.CourseMapper;
import com.kairo.backend.repository.AttendanceLogRepository;
import com.kairo.backend.repository.EnrollmentRepository;
import com.kairo.backend.repository.OfficialBaselineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SubjectService {

    private final EnrollmentRepository enrollmentRepository;
    private final OfficialBaselineRepository baselineRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public SubjectService(
            EnrollmentRepository enrollmentRepository,
            OfficialBaselineRepository baselineRepository,
            AttendanceLogRepository attendanceLogRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.baselineRepository = baselineRepository;
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getEnrolledCourses(UUID userId) {
        List<EnrollmentEntity> enrollments = enrollmentRepository.findByUserIdAndDeletedAtIsNull(userId);
        return enrollments.stream().map(this::mapToCourseResponse).toList();
    }

    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseDetail(UUID userId, UUID courseId) {
        EnrollmentEntity enrollment = enrollmentRepository.findByUserIdAndCourseIdAndDeletedAtIsNull(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found or user not enrolled in course: " + courseId));

        CourseResponse courseResponse = mapToCourseResponse(enrollment);

        List<AttendanceLogEntity> logs = attendanceLogRepository
                .findAllByUserIdAndEnrollmentIdAndDeletedAtIsNullOrderByLogDateDescCreatedAtDesc(userId, enrollment.getId());

        List<AttendanceLogResponse> logResponses = logs.stream()
                .map(AttendanceMapper::toAttendanceLogResponse)
                .toList();

        return CourseDetailResponse.builder()
                .course(courseResponse)
                .attendanceLogs(logResponses)
                .build();
    }

    public CourseResponse mapToCourseResponse(EnrollmentEntity enrollment) {
        Double baselinePct = baselineRepository.findTopByEnrollmentIdOrderByPublishedDateDesc(enrollment.getId())
                .map(b -> b.getBaselinePercentage().doubleValue())
                .orElse(null);

        int attended = enrollment.getAttendedClasses();
        int total = enrollment.getTotalClasses();

        Integer canSkip = calculateCanSkip(attended, total, 0.75);
        Integer mustAttend = calculateMustAttend(attended, total, 0.75);

        return CourseMapper.toCourseResponse(enrollment, baselinePct, canSkip, mustAttend);
    }

    public Integer calculateCanSkip(int attended, int total, double targetPct) {
        if (total == 0) return 0;
        double currentPct = (double) attended / total;
        if (currentPct < targetPct) return 0;

        int canSkip = (int) Math.floor((attended - targetPct * total) / targetPct);
        return Math.max(0, canSkip);
    }

    public Integer calculateMustAttend(int attended, int total, double targetPct) {
        if (total == 0) return 0;
        double currentPct = (double) attended / total;
        if (currentPct >= targetPct) return 0;

        int mustAttend = (int) Math.ceil((targetPct * total - attended) / (1 - targetPct));
        return Math.max(0, mustAttend);
    }
}
