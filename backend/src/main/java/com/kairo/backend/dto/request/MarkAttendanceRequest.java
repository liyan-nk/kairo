package com.kairo.backend.dto.request;

import com.kairo.backend.entity.AttendanceStatusEnum;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class MarkAttendanceRequest {

    @NotNull(message = "Course ID is required")
    private UUID courseId;

    private UUID slotId;

    @NotNull(message = "Log date is required")
    private LocalDate date;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatusEnum status;

    private String notes;

    public MarkAttendanceRequest() {
    }

    public MarkAttendanceRequest(UUID courseId, UUID slotId, LocalDate date, AttendanceStatusEnum status, String notes) {
        this.courseId = courseId;
        this.slotId = slotId;
        this.date = date;
        this.status = status;
        this.notes = notes;
    }

    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }

    public UUID getSlotId() { return slotId; }
    public void setSlotId(UUID slotId) { this.slotId = slotId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public AttendanceStatusEnum getStatus() { return status; }
    public void setStatus(AttendanceStatusEnum status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static MarkAttendanceRequestBuilder builder() {
        return new MarkAttendanceRequestBuilder();
    }

    public static class MarkAttendanceRequestBuilder {
        private UUID courseId;
        private UUID slotId;
        private LocalDate date;
        private AttendanceStatusEnum status;
        private String notes;

        public MarkAttendanceRequestBuilder courseId(UUID courseId) { this.courseId = courseId; return this; }
        public MarkAttendanceRequestBuilder slotId(UUID slotId) { this.slotId = slotId; return this; }
        public MarkAttendanceRequestBuilder date(LocalDate date) { this.date = date; return this; }
        public MarkAttendanceRequestBuilder status(AttendanceStatusEnum status) { this.status = status; return this; }
        public MarkAttendanceRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public MarkAttendanceRequest build() {
            return new MarkAttendanceRequest(courseId, slotId, date, status, notes);
        }
    }
}
