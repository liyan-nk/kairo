package com.kairo.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class CreateProxyReportRequest {

    @NotNull(message = "Timetable slot ID is required")
    private UUID timetableSlotId;

    @NotBlank(message = "Actual subject name is required")
    private String actualSubject;

    private String room;
    private String faculty;

    @NotNull(message = "Report date is required")
    private LocalDate date;

    public CreateProxyReportRequest() {
    }

    public CreateProxyReportRequest(UUID timetableSlotId, String actualSubject, String room, String faculty, LocalDate date) {
        this.timetableSlotId = timetableSlotId;
        this.actualSubject = actualSubject;
        this.room = room;
        this.faculty = faculty;
        this.date = date;
    }

    public UUID getTimetableSlotId() { return timetableSlotId; }
    public void setTimetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; }

    public String getActualSubject() { return actualSubject; }
    public void setActualSubject(String actualSubject) { this.actualSubject = actualSubject; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public static CreateProxyReportRequestBuilder builder() {
        return new CreateProxyReportRequestBuilder();
    }

    public static class CreateProxyReportRequestBuilder {
        private UUID timetableSlotId;
        private String actualSubject;
        private String room;
        private String faculty;
        private LocalDate date;

        public CreateProxyReportRequestBuilder timetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; return this; }
        public CreateProxyReportRequestBuilder actualSubject(String actualSubject) { this.actualSubject = actualSubject; return this; }
        public CreateProxyReportRequestBuilder room(String room) { this.room = room; return this; }
        public CreateProxyReportRequestBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public CreateProxyReportRequestBuilder date(LocalDate date) { this.date = date; return this; }

        public CreateProxyReportRequest build() {
            return new CreateProxyReportRequest(timetableSlotId, actualSubject, room, faculty, date);
        }
    }
}
