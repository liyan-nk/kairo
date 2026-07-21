package com.kairo.backend.dto.response;

import com.kairo.backend.entity.ScheduleStateEnum;

import java.util.List;

public class TodayResponse {

    private TimetableSlotResponse currentClass;
    private TimetableSlotResponse nextClass;
    private ScheduleStateEnum scheduleState;
    private List<TimetableSlotResponse> completedClasses;
    private List<TimetableSlotResponse> todayTimetable;
    private List<AttendanceLogResponse> todayAttendance;

    public TodayResponse() {
    }

    public TodayResponse(TimetableSlotResponse currentClass, TimetableSlotResponse nextClass, ScheduleStateEnum scheduleState, List<TimetableSlotResponse> completedClasses, List<TimetableSlotResponse> todayTimetable, List<AttendanceLogResponse> todayAttendance) {
        this.currentClass = currentClass;
        this.nextClass = nextClass;
        this.scheduleState = scheduleState;
        this.completedClasses = completedClasses;
        this.todayTimetable = todayTimetable;
        this.todayAttendance = todayAttendance;
    }

    public TimetableSlotResponse getCurrentClass() { return currentClass; }
    public void setCurrentClass(TimetableSlotResponse currentClass) { this.currentClass = currentClass; }

    public TimetableSlotResponse getNextClass() { return nextClass; }
    public void setNextClass(TimetableSlotResponse nextClass) { this.nextClass = nextClass; }

    public ScheduleStateEnum getScheduleState() { return scheduleState; }
    public void setScheduleState(ScheduleStateEnum scheduleState) { this.scheduleState = scheduleState; }

    public List<TimetableSlotResponse> getCompletedClasses() { return completedClasses; }
    public void setCompletedClasses(List<TimetableSlotResponse> completedClasses) { this.completedClasses = completedClasses; }

    public List<TimetableSlotResponse> getTodayTimetable() { return todayTimetable; }
    public void setTodayTimetable(List<TimetableSlotResponse> todayTimetable) { this.todayTimetable = todayTimetable; }

    public List<AttendanceLogResponse> getTodayAttendance() { return todayAttendance; }
    public void setTodayAttendance(List<AttendanceLogResponse> todayAttendance) { this.todayAttendance = todayAttendance; }

    public static TodayResponseBuilder builder() {
        return new TodayResponseBuilder();
    }

    public static class TodayResponseBuilder {
        private TimetableSlotResponse currentClass;
        private TimetableSlotResponse nextClass;
        private ScheduleStateEnum scheduleState;
        private List<TimetableSlotResponse> completedClasses;
        private List<TimetableSlotResponse> todayTimetable;
        private List<AttendanceLogResponse> todayAttendance;

        public TodayResponseBuilder currentClass(TimetableSlotResponse currentClass) { this.currentClass = currentClass; return this; }
        public TodayResponseBuilder nextClass(TimetableSlotResponse nextClass) { this.nextClass = nextClass; return this; }
        public TodayResponseBuilder scheduleState(ScheduleStateEnum scheduleState) { this.scheduleState = scheduleState; return this; }
        public TodayResponseBuilder completedClasses(List<TimetableSlotResponse> completedClasses) { this.completedClasses = completedClasses; return this; }
        public TodayResponseBuilder todayTimetable(List<TimetableSlotResponse> todayTimetable) { this.todayTimetable = todayTimetable; return this; }
        public TodayResponseBuilder todayAttendance(List<AttendanceLogResponse> todayAttendance) { this.todayAttendance = todayAttendance; return this; }

        public TodayResponse build() {
            return new TodayResponse(currentClass, nextClass, scheduleState, completedClasses, todayTimetable, todayAttendance);
        }
    }
}
