package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.entity.CourseEntity;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.entity.TimetableSlotEntity;

public class TimetableMapper {

    public static TimetableSlotResponse toTimetableSlotResponse(TimetableSlotEntity slot) {
        if (slot == null) {
            return null;
        }

        EnrollmentEntity enrollment = slot.getEnrollment();
        CourseEntity course = enrollment != null ? enrollment.getCourse() : null;

        String room = slot.getRoom() != null ? slot.getRoom() : (course != null ? course.getRoom() : "");
        String faculty = slot.getFaculty() != null ? slot.getFaculty() : (course != null ? course.getFaculty() : "");
        String subjectName = slot.getSubjectName() != null ? slot.getSubjectName() : (course != null ? course.getName() : "");

        return TimetableSlotResponse.builder()
                .id(slot.getId())
                .courseId(enrollment != null ? enrollment.getCourseId() : null)
                .dayOfWeek(slot.getDayOfWeek())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .room(room)
                .faculty(faculty)
                .subjectName(subjectName)
                .isBreak(slot.isBreak())
                .build();
    }
}
