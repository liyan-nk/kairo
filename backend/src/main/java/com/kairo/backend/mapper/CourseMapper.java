package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.CourseResponse;
import com.kairo.backend.entity.CourseEntity;
import com.kairo.backend.entity.EnrollmentEntity;

public class CourseMapper {

    public static CourseResponse toCourseResponse(
            EnrollmentEntity enrollment,
            Double baselinePercentage,
            Integer canSkipClasses,
            Integer mustAttendClasses
    ) {
        if (enrollment == null) {
            return null;
        }

        CourseEntity course = enrollment.getCourse();
        int total = enrollment.getTotalClasses();
        int attended = enrollment.getAttendedClasses();
        double pct = total > 0 ? Math.round((double) attended / total * 1000.0) / 10.0 : 0.0;

        String status = "ON_TRACK";
        if (pct < 75.0 && total > 0) {
            status = pct < 65.0 ? "CRITICAL" : "AT_RISK";
        }

        return CourseResponse.builder()
                .id(course != null ? course.getId() : enrollment.getCourseId())
                .code(course != null ? course.getCode() : "")
                .name(course != null ? course.getName() : "")
                .faculty(course != null ? course.getFaculty() : "")
                .room(course != null ? course.getRoom() : "")
                .totalClasses(total)
                .attendedClasses(attended)
                .percentage(pct)
                .status(status)
                .baselinePercentage(baselinePercentage)
                .canSkipClasses(canSkipClasses)
                .mustAttendClasses(mustAttendClasses)
                .build();
    }
}
