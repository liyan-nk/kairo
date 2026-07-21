package com.kairo.backend.dto.response;

import com.kairo.backend.entity.AttendanceStatusEnum;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class AttendanceLogResponse {

    private UUID id;
    private UUID courseId;
    private UUID slotId;
    private LocalDate date;
    private AttendanceStatusEnum status;
    private String notes;
    private Instant createdAt;

    public AttendanceLogResponse() {
    }

    public AttendanceLogResponse(UUID id, UUID courseId, UUID slotId, LocalDate date, AttendanceStatusEnum status, String notes, Instant createdAt) {
        this.id = id;
        this.courseId = courseId;
        this.slotId = slotId;
        this.date = date;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static AttendanceLogResponseBuilder builder() {
        return new AttendanceLogResponseBuilder();
    }

    public static class AttendanceLogResponseBuilder {
        private UUID id;
        private UUID courseId;
        private UUID slotId;
        private LocalDate date;
        private AttendanceStatusEnum status;
        private String notes;
        private Instant createdAt;

        public AttendanceLogResponseBuilder id(UUID id) { this.id = id; return this; }
        public AttendanceLogResponseBuilder courseId(UUID courseId) { this.courseId = courseId; return this; }
        public AttendanceLogResponseBuilder slotId(UUID slotId) { this.slotId = slotId; return this; }
        public AttendanceLogResponseBuilder date(LocalDate date) { this.date = date; return this; }
        public AttendanceLogResponseBuilder status(AttendanceStatusEnum status) { this.status = status; return this; }
        public AttendanceLogResponseBuilder notes(String notes) { this.notes = notes; return this; }
        public AttendanceLogResponseBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AttendanceLogResponse build() {
            return new AttendanceLogResponse(id, courseId, slotId, date, status, notes, createdAt);
        }
    }
}
