package com.kairo.backend.dto.response;

import java.util.List;

public class CourseDetailResponse {

    private CourseResponse course;
    private List<AttendanceLogResponse> attendanceLogs;

    public CourseDetailResponse() {
    }

    public CourseDetailResponse(CourseResponse course, List<AttendanceLogResponse> attendanceLogs) {
        this.course = course;
        this.attendanceLogs = attendanceLogs;
    }

    public CourseResponse getCourse() { return course; }
    public void setCourse(CourseResponse course) { this.course = course; }

    public List<AttendanceLogResponse> getAttendanceLogs() { return attendanceLogs; }
    public void setAttendanceLogs(List<AttendanceLogResponse> attendanceLogs) { this.attendanceLogs = attendanceLogs; }

    public static CourseDetailResponseBuilder builder() {
        return new CourseDetailResponseBuilder();
    }

    public static class CourseDetailResponseBuilder {
        private CourseResponse course;
        private List<AttendanceLogResponse> attendanceLogs;

        public CourseDetailResponseBuilder course(CourseResponse course) { this.course = course; return this; }
        public CourseDetailResponseBuilder attendanceLogs(List<AttendanceLogResponse> attendanceLogs) { this.attendanceLogs = attendanceLogs; return this; }

        public CourseDetailResponse build() {
            return new CourseDetailResponse(course, attendanceLogs);
        }
    }
}
