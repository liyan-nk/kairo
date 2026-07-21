package com.kairo.backend.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public class ProxyReportResponse {

    private UUID id;
    private UUID timetableSlotId;
    private String expectedSubject;
    private String actualSubject;
    private String room;
    private String faculty;
    private int reportCount;
    private String status;
    private LocalDate date;

    public ProxyReportResponse() {
    }

    public ProxyReportResponse(UUID id, UUID timetableSlotId, String expectedSubject, String actualSubject, String room, String faculty, int reportCount, String status, LocalDate date) {
        this.id = id;
        this.timetableSlotId = timetableSlotId;
        this.expectedSubject = expectedSubject;
        this.actualSubject = actualSubject;
        this.room = room;
        this.faculty = faculty;
        this.reportCount = reportCount;
        this.status = status;
        this.date = date;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTimetableSlotId() { return timetableSlotId; }
    public void setTimetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; }

    public String getExpectedSubject() { return expectedSubject; }
    public void setExpectedSubject(String expectedSubject) { this.expectedSubject = expectedSubject; }

    public String getActualSubject() { return actualSubject; }
    public void setActualSubject(String actualSubject) { this.actualSubject = actualSubject; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public int getReportCount() { return reportCount; }
    public void setReportCount(int reportCount) { this.reportCount = reportCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public static ProxyReportResponseBuilder builder() {
        return new ProxyReportResponseBuilder();
    }

    public static class ProxyReportResponseBuilder {
        private UUID id;
        private UUID timetableSlotId;
        private String expectedSubject;
        private String actualSubject;
        private String room;
        private String faculty;
        private int reportCount;
        private String status;
        private LocalDate date;

        public ProxyReportResponseBuilder id(UUID id) { this.id = id; return this; }
        public ProxyReportResponseBuilder timetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; return this; }
        public ProxyReportResponseBuilder expectedSubject(String expectedSubject) { this.expectedSubject = expectedSubject; return this; }
        public ProxyReportResponseBuilder actualSubject(String actualSubject) { this.actualSubject = actualSubject; return this; }
        public ProxyReportResponseBuilder room(String room) { this.room = room; return this; }
        public ProxyReportResponseBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public ProxyReportResponseBuilder reportCount(int reportCount) { this.reportCount = reportCount; return this; }
        public ProxyReportResponseBuilder status(String status) { this.status = status; return this; }
        public ProxyReportResponseBuilder date(LocalDate date) { this.date = date; return this; }

        public ProxyReportResponse build() {
            return new ProxyReportResponse(id, timetableSlotId, expectedSubject, actualSubject, room, faculty, reportCount, status, date);
        }
    }
}
