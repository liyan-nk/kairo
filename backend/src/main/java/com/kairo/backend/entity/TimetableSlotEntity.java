package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "timetable_slots")
public class TimetableSlotEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "enrollment_id")
    private UUID enrollmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", insertable = false, updatable = false)
    private EnrollmentEntity enrollment;

    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    private DayOfWeekEnum dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "room")
    private String room;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "is_break", nullable = false)
    private boolean isBreak = false;

    public TimetableSlotEntity() {
    }

    public TimetableSlotEntity(UUID id, UUID enrollmentId, EnrollmentEntity enrollment, DayOfWeekEnum dayOfWeek, LocalTime startTime, LocalTime endTime, String room, String faculty, String subjectName, boolean isBreak) {
        this.id = id;
        this.enrollmentId = enrollmentId;
        this.enrollment = enrollment;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.faculty = faculty;
        this.subjectName = subjectName;
        this.isBreak = isBreak;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; }

    public EnrollmentEntity getEnrollment() { return enrollment; }
    public void setEnrollment(EnrollmentEntity enrollment) { this.enrollment = enrollment; }

    public DayOfWeekEnum getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeekEnum dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public boolean isBreak() { return isBreak; }
    public void setBreak(boolean aBreak) { isBreak = aBreak; }

    public static TimetableSlotEntityBuilder builder() {
        return new TimetableSlotEntityBuilder();
    }

    public static class TimetableSlotEntityBuilder {
        private UUID id;
        private UUID enrollmentId;
        private EnrollmentEntity enrollment;
        private DayOfWeekEnum dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private String room;
        private String faculty;
        private String subjectName;
        private boolean isBreak = false;

        public TimetableSlotEntityBuilder id(UUID id) { this.id = id; return this; }
        public TimetableSlotEntityBuilder enrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; return this; }
        public TimetableSlotEntityBuilder enrollment(EnrollmentEntity enrollment) { this.enrollment = enrollment; return this; }
        public TimetableSlotEntityBuilder dayOfWeek(DayOfWeekEnum dayOfWeek) { this.dayOfWeek = dayOfWeek; return this; }
        public TimetableSlotEntityBuilder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public TimetableSlotEntityBuilder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public TimetableSlotEntityBuilder room(String room) { this.room = room; return this; }
        public TimetableSlotEntityBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public TimetableSlotEntityBuilder subjectName(String subjectName) { this.subjectName = subjectName; return this; }
        public TimetableSlotEntityBuilder isBreak(boolean isBreak) { this.isBreak = isBreak; return this; }

        public TimetableSlotEntity build() {
            return new TimetableSlotEntity(id, enrollmentId, enrollment, dayOfWeek, startTime, endTime, room, faculty, subjectName, isBreak);
        }
    }
}
