package com.kairo.backend.dto.response;

import com.kairo.backend.entity.DayOfWeekEnum;

import java.time.LocalTime;
import java.util.UUID;

public class TimetableSlotResponse {

    private UUID id;
    private UUID courseId;
    private DayOfWeekEnum dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private String faculty;
    private String subjectName;
    private boolean isBreak;

    public TimetableSlotResponse() {
    }

    public TimetableSlotResponse(UUID id, UUID courseId, DayOfWeekEnum dayOfWeek, LocalTime startTime, LocalTime endTime, String room, String faculty, String subjectName, boolean isBreak) {
        this.id = id;
        this.courseId = courseId;
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

    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }

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

    public static TimetableSlotResponseBuilder builder() {
        return new TimetableSlotResponseBuilder();
    }

    public static class TimetableSlotResponseBuilder {
        private UUID id;
        private UUID courseId;
        private DayOfWeekEnum dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private String room;
        private String faculty;
        private String subjectName;
        private boolean isBreak;

        public TimetableSlotResponseBuilder id(UUID id) { this.id = id; return this; }
        public TimetableSlotResponseBuilder courseId(UUID courseId) { this.courseId = courseId; return this; }
        public TimetableSlotResponseBuilder dayOfWeek(DayOfWeekEnum dayOfWeek) { this.dayOfWeek = dayOfWeek; return this; }
        public TimetableSlotResponseBuilder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public TimetableSlotResponseBuilder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public TimetableSlotResponseBuilder room(String room) { this.room = room; return this; }
        public TimetableSlotResponseBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public TimetableSlotResponseBuilder subjectName(String subjectName) { this.subjectName = subjectName; return this; }
        public TimetableSlotResponseBuilder isBreak(boolean isBreak) { this.isBreak = isBreak; return this; }

        public TimetableSlotResponse build() {
            return new TimetableSlotResponse(id, courseId, dayOfWeek, startTime, endTime, room, faculty, subjectName, isBreak);
        }
    }
}
