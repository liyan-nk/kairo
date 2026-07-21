package com.kairo.backend.dto.response;

import java.util.UUID;

public class CourseResponse {

    private UUID id;
    private String code;
    private String name;
    private String faculty;
    private String room;
    private int totalClasses;
    private int attendedClasses;
    private double percentage;
    private String status;
    private Double baselinePercentage;
    private Integer canSkipClasses;
    private Integer mustAttendClasses;

    public CourseResponse() {
    }

    public CourseResponse(UUID id, String code, String name, String faculty, String room, int totalClasses, int attendedClasses, double percentage, String status, Double baselinePercentage, Integer canSkipClasses, Integer mustAttendClasses) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.faculty = faculty;
        this.room = room;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.percentage = percentage;
        this.status = status;
        this.baselinePercentage = baselinePercentage;
        this.canSkipClasses = canSkipClasses;
        this.mustAttendClasses = mustAttendClasses;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getBaselinePercentage() { return baselinePercentage; }
    public void setBaselinePercentage(Double baselinePercentage) { this.baselinePercentage = baselinePercentage; }

    public Integer getCanSkipClasses() { return canSkipClasses; }
    public void setCanSkipClasses(Integer canSkipClasses) { this.canSkipClasses = canSkipClasses; }

    public Integer getMustAttendClasses() { return mustAttendClasses; }
    public void setMustAttendClasses(Integer mustAttendClasses) { this.mustAttendClasses = mustAttendClasses; }

    public static CourseResponseBuilder builder() {
        return new CourseResponseBuilder();
    }

    public static class CourseResponseBuilder {
        private UUID id;
        private String code;
        private String name;
        private String faculty;
        private String room;
        private int totalClasses;
        private int attendedClasses;
        private double percentage;
        private String status;
        private Double baselinePercentage;
        private Integer canSkipClasses;
        private Integer mustAttendClasses;

        public CourseResponseBuilder id(UUID id) { this.id = id; return this; }
        public CourseResponseBuilder code(String code) { this.code = code; return this; }
        public CourseResponseBuilder name(String name) { this.name = name; return this; }
        public CourseResponseBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public CourseResponseBuilder room(String room) { this.room = room; return this; }
        public CourseResponseBuilder totalClasses(int totalClasses) { this.totalClasses = totalClasses; return this; }
        public CourseResponseBuilder attendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; return this; }
        public CourseResponseBuilder percentage(double percentage) { this.percentage = percentage; return this; }
        public CourseResponseBuilder status(String status) { this.status = status; return this; }
        public CourseResponseBuilder baselinePercentage(Double baselinePercentage) { this.baselinePercentage = baselinePercentage; return this; }
        public CourseResponseBuilder canSkipClasses(Integer canSkipClasses) { this.canSkipClasses = canSkipClasses; return this; }
        public CourseResponseBuilder mustAttendClasses(Integer mustAttendClasses) { this.mustAttendClasses = mustAttendClasses; return this; }

        public CourseResponse build() {
            return new CourseResponse(id, code, name, faculty, room, totalClasses, attendedClasses, percentage, status, baselinePercentage, canSkipClasses, mustAttendClasses);
        }
    }
}
