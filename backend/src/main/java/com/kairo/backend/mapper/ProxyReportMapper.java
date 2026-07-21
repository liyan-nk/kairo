package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.ProxyReportResponse;
import com.kairo.backend.entity.ProxyReportEntity;

public class ProxyReportMapper {

    public static ProxyReportResponse toResponse(ProxyReportEntity report) {
        if (report == null) {
            return null;
        }

        return ProxyReportResponse.builder()
                .id(report.getId())
                .timetableSlotId(report.getTimetableSlotId())
                .expectedSubject(report.getExpectedSubject())
                .actualSubject(report.getActualSubject())
                .room(report.getRoom())
                .faculty(report.getFaculty())
                .reportCount(report.getReportCount())
                .status(report.getStatus().getDisplayName())
                .date(report.getReportDate())
                .build();
    }
}
