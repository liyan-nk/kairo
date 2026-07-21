package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "attendance_logs")
public class AttendanceLogEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "enrollment_id", nullable = false)
    private UUID enrollmentId;

    @Column(name = "timetable_slot_id")
    private UUID timetableSlotId;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AttendanceStatusEnum status;

    @Column(name = "notes")
    private String notes;

    public AttendanceLogEntity() {
    }

    public AttendanceLogEntity(UUID id, UUID userId, UUID enrollmentId, UUID timetableSlotId, LocalDate logDate, AttendanceStatusEnum status, String notes) {
        this.id = id;
        this.userId = userId;
        this.enrollmentId = enrollmentId;
        this.timetableSlotId = timetableSlotId;
        this.logDate = logDate;
        this.status = status;
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; }

    public UUID getTimetableSlotId() { return timetableSlotId; }
    public void setTimetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; }

    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }

    public AttendanceStatusEnum getStatus() { return status; }
    public void setStatus(AttendanceStatusEnum status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static AttendanceLogEntityBuilder builder() {
        return new AttendanceLogEntityBuilder();
    }

    public static class AttendanceLogEntityBuilder {
        private UUID id;
        private UUID userId;
        private UUID enrollmentId;
        private UUID timetableSlotId;
        private LocalDate logDate;
        private AttendanceStatusEnum status;
        private String notes;

        public AttendanceLogEntityBuilder id(UUID id) { this.id = id; return this; }
        public AttendanceLogEntityBuilder userId(UUID userId) { this.userId = userId; return this; }
        public AttendanceLogEntityBuilder enrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; return this; }
        public AttendanceLogEntityBuilder timetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; return this; }
        public AttendanceLogEntityBuilder logDate(LocalDate logDate) { this.logDate = logDate; return this; }
        public AttendanceLogEntityBuilder status(AttendanceStatusEnum status) { this.status = status; return this; }
        public AttendanceLogEntityBuilder notes(String notes) { this.notes = notes; return this; }

        public AttendanceLogEntity build() {
            return new AttendanceLogEntity(id, userId, enrollmentId, timetableSlotId, logDate, status, notes);
        }
    }
}
