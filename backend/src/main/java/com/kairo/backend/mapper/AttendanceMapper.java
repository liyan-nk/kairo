package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.entity.AttendanceLogEntity;

public class AttendanceMapper {

    public static AttendanceLogResponse toAttendanceLogResponse(AttendanceLogEntity log) {
        if (log == null) {
            return null;
        }

        return AttendanceLogResponse.builder()
                .id(log.getId())
                .courseId(log.getEnrollmentId())
                .slotId(log.getTimetableSlotId())
                .date(log.getLogDate())
                .status(log.getStatus())
                .notes(log.getNotes())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
