package com.kairo.backend.service;

import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.dto.response.TodayResponse;
import com.kairo.backend.entity.AttendanceLogEntity;
import com.kairo.backend.entity.DayOfWeekEnum;
import com.kairo.backend.entity.ScheduleStateEnum;
import com.kairo.backend.mapper.AttendanceMapper;
import com.kairo.backend.repository.AttendanceLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TodayService {

    private final TimetableService timetableService;
    private final AttendanceLogRepository attendanceLogRepository;

    public TodayService(
            TimetableService timetableService,
            AttendanceLogRepository attendanceLogRepository
    ) {
        this.timetableService = timetableService;
        this.attendanceLogRepository = attendanceLogRepository;
    }

    @Transactional(readOnly = true)
    public TodayResponse getTodaySummary(UUID userId, LocalDate date, LocalTime currentTime) {
        DayOfWeekEnum dayOfWeek = mapDayOfWeek(date.getDayOfWeek());
        List<TimetableSlotResponse> todaySlots = timetableService.getDailyTimetable(userId, dayOfWeek);

        List<AttendanceLogEntity> logs = attendanceLogRepository.findAllByUserIdAndLogDateAndDeletedAtIsNull(userId, date);
        List<AttendanceLogResponse> attendanceResponses = logs.stream()
                .map(AttendanceMapper::toAttendanceLogResponse)
                .toList();

        if (todaySlots.isEmpty()) {
            return TodayResponse.builder()
                    .currentClass(null)
                    .nextClass(null)
                    .scheduleState(ScheduleStateEnum.EMPTY)
                    .completedClasses(List.of())
                    .todayTimetable(List.of())
                    .todayAttendance(attendanceResponses)
                    .build();
        }

        TimetableSlotResponse currentClass = null;
        TimetableSlotResponse nextClass = null;
        List<TimetableSlotResponse> completedClasses = new ArrayList<>();

        for (int i = 0; i < todaySlots.size(); i++) {
            TimetableSlotResponse slot = todaySlots.get(i);

            if (currentTime.isAfter(slot.getEndTime()) || currentTime.equals(slot.getEndTime())) {
                completedClasses.add(slot);
            } else if ((currentTime.isAfter(slot.getStartTime()) || currentTime.equals(slot.getStartTime()))
                    && currentTime.isBefore(slot.getEndTime())) {
                currentClass = slot;
                if (i + 1 < todaySlots.size()) {
                    nextClass = todaySlots.get(i + 1);
                }
                break;
            } else if (currentTime.isBefore(slot.getStartTime())) {
                if (nextClass == null) {
                    nextClass = slot;
                }
            }
        }

        ScheduleStateEnum scheduleState;
        if (completedClasses.size() == todaySlots.size()) {
            scheduleState = ScheduleStateEnum.FINISHED;
        } else if (currentClass != null) {
            scheduleState = currentClass.isBreak() ? ScheduleStateEnum.BREAK : ScheduleStateEnum.CURRENT;
        } else {
            scheduleState = ScheduleStateEnum.BREAK;
        }

        return TodayResponse.builder()
                .currentClass(currentClass)
                .nextClass(nextClass)
                .scheduleState(scheduleState)
                .completedClasses(completedClasses)
                .todayTimetable(todaySlots)
                .todayAttendance(attendanceResponses)
                .build();
    }

    private DayOfWeekEnum mapDayOfWeek(java.time.DayOfWeek day) {
        return switch (day) {
            case MONDAY -> DayOfWeekEnum.MON;
            case TUESDAY -> DayOfWeekEnum.TUE;
            case WEDNESDAY -> DayOfWeekEnum.WED;
            case THURSDAY -> DayOfWeekEnum.THU;
            case FRIDAY -> DayOfWeekEnum.FRI;
            case SATURDAY -> DayOfWeekEnum.SAT;
            case SUNDAY -> DayOfWeekEnum.SUN;
        };
    }
}
