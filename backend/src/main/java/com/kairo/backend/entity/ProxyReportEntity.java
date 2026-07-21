package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "proxy_reports")
public class ProxyReportEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Column(name = "timetable_slot_id", nullable = false)
    private UUID timetableSlotId;

    @Column(name = "actual_course_id")
    private UUID actualCourseId;

    @Column(name = "expected_subject", nullable = false)
    private String expectedSubject;

    @Column(name = "actual_subject", nullable = false)
    private String actualSubject;

    @Column(name = "room")
    private String room;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "report_count", nullable = false)
    private int reportCount = 1;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ConsensusStatusEnum status = ConsensusStatusEnum.PENDING;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    public ProxyReportEntity() {
    }

    public ProxyReportEntity(UUID id, UUID reporterId, UUID timetableSlotId, UUID actualCourseId, String expectedSubject, String actualSubject, String room, String faculty, int reportCount, ConsensusStatusEnum status, LocalDate reportDate) {
        this.id = id;
        this.reporterId = reporterId;
        this.timetableSlotId = timetableSlotId;
        this.actualCourseId = actualCourseId;
        this.expectedSubject = expectedSubject;
        this.actualSubject = actualSubject;
        this.room = room;
        this.faculty = faculty;
        this.reportCount = reportCount;
        this.status = status;
        this.reportDate = reportDate;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getReporterId() { return reporterId; }
    public void setReporterId(UUID reporterId) { this.reporterId = reporterId; }

    public UUID getTimetableSlotId() { return timetableSlotId; }
    public void setTimetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; }

    public UUID getActualCourseId() { return actualCourseId; }
    public void setActualCourseId(UUID actualCourseId) { this.actualCourseId = actualCourseId; }

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

    public ConsensusStatusEnum getStatus() { return status; }
    public void setStatus(ConsensusStatusEnum status) { this.status = status; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

    public static ProxyReportEntityBuilder builder() {
        return new ProxyReportEntityBuilder();
    }

    public static class ProxyReportEntityBuilder {
        private UUID id;
        private UUID reporterId;
        private UUID timetableSlotId;
        private UUID actualCourseId;
        private String expectedSubject;
        private String actualSubject;
        private String room;
        private String faculty;
        private int reportCount = 1;
        private ConsensusStatusEnum status = ConsensusStatusEnum.PENDING;
        private LocalDate reportDate;

        public ProxyReportEntityBuilder id(UUID id) { this.id = id; return this; }
        public ProxyReportEntityBuilder reporterId(UUID reporterId) { this.reporterId = reporterId; return this; }
        public ProxyReportEntityBuilder timetableSlotId(UUID timetableSlotId) { this.timetableSlotId = timetableSlotId; return this; }
        public ProxyReportEntityBuilder actualCourseId(UUID actualCourseId) { this.actualCourseId = actualCourseId; return this; }
        public ProxyReportEntityBuilder expectedSubject(String expectedSubject) { this.expectedSubject = expectedSubject; return this; }
        public ProxyReportEntityBuilder actualSubject(String actualSubject) { this.actualSubject = actualSubject; return this; }
        public ProxyReportEntityBuilder room(String room) { this.room = room; return this; }
        public ProxyReportEntityBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public ProxyReportEntityBuilder reportCount(int reportCount) { this.reportCount = reportCount; return this; }
        public ProxyReportEntityBuilder status(ConsensusStatusEnum status) { this.status = status; return this; }
        public ProxyReportEntityBuilder reportDate(LocalDate reportDate) { this.reportDate = reportDate; return this; }

        public ProxyReportEntity build() {
            return new ProxyReportEntity(id, reporterId, timetableSlotId, actualCourseId, expectedSubject, actualSubject, room, faculty, reportCount, status, reportDate);
        }
    }
}
