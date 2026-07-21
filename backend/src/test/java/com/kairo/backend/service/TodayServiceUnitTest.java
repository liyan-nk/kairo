package com.kairo.backend.service;

import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.dto.response.TodayResponse;
import com.kairo.backend.entity.DayOfWeekEnum;
import com.kairo.backend.entity.EnrollmentEntity;
import com.kairo.backend.entity.ScheduleStateEnum;
import com.kairo.backend.entity.TimetableSlotEntity;
import com.kairo.backend.repository.AttendanceLogRepository;
import com.kairo.backend.repository.TimetableSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodayServiceUnitTest {

    @Mock
    private TimetableSlotRepository timetableSlotRepository;

    @Mock
    private AttendanceLogRepository attendanceLogRepository;

    private TimetableService timetableService;
    private TodayService todayService;

    private final UUID userId = UUID.randomUUID();
    private final LocalDate todayDate = LocalDate.of(2026, 7, 20); // Monday

    @BeforeEach
    void setUp() {
        timetableService = new TimetableService(timetableSlotRepository);
        todayService = new TodayService(timetableService, attendanceLogRepository);
    }

    @Test
    @DisplayName("getTodaySummary should return EMPTY state when no classes exist for the day")
    void getTodaySummary_EmptySchedule() {
        when(timetableSlotRepository.findAllByUserIdAndDayOfWeek(eq(userId), eq(DayOfWeekEnum.MON))).thenReturn(List.of());
        when(attendanceLogRepository.findAllByUserIdAndLogDateAndDeletedAtIsNull(eq(userId), eq(todayDate))).thenReturn(List.of());

        TodayResponse response = todayService.getTodaySummary(userId, todayDate, LocalTime.of(9, 0));

        assertEquals(ScheduleStateEnum.EMPTY, response.getScheduleState());
        assertNull(response.getCurrentClass());
        assertNull(response.getNextClass());
        assertTrue(response.getCompletedClasses().isEmpty());
    }

    @Test
    @DisplayName("getTodaySummary should return CURRENT state when active class slot is running")
    void getTodaySummary_CurrentClassActive() {
        TimetableSlotEntity slot1 = TimetableSlotEntity.builder()
                .id(UUID.randomUUID())
                .subjectName("Math")
                .dayOfWeek(DayOfWeekEnum.MON)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(10, 0))
                .isBreak(false)
                .build();

        TimetableSlotEntity slot2 = TimetableSlotEntity.builder()
                .id(UUID.randomUUID())
                .subjectName("Physics")
                .dayOfWeek(DayOfWeekEnum.MON)
                .startTime(LocalTime.of(10, 15))
                .endTime(LocalTime.of(11, 15))
                .isBreak(false)
                .build();

        when(timetableSlotRepository.findAllByUserIdAndDayOfWeek(eq(userId), eq(DayOfWeekEnum.MON))).thenReturn(List.of(slot1, slot2));
        when(attendanceLogRepository.findAllByUserIdAndLogDateAndDeletedAtIsNull(eq(userId), eq(todayDate))).thenReturn(List.of());

        // Current time is 09:30 -> inside Math slot
        TodayResponse response = todayService.getTodaySummary(userId, todayDate, LocalTime.of(9, 30));

        assertEquals(ScheduleStateEnum.CURRENT, response.getScheduleState());
        assertNotNull(response.getCurrentClass());
        assertEquals("Math", response.getCurrentClass().getSubjectName());
        assertNotNull(response.getNextClass());
        assertEquals("Physics", response.getNextClass().getSubjectName());
    }

    @Test
    @DisplayName("getTodaySummary should return FINISHED state when all classes for the day have ended")
    void getTodaySummary_FinishedSchedule() {
        TimetableSlotEntity slot1 = TimetableSlotEntity.builder()
                .id(UUID.randomUUID())
                .subjectName("Math")
                .dayOfWeek(DayOfWeekEnum.MON)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(10, 0))
                .isBreak(false)
                .build();

        when(timetableSlotRepository.findAllByUserIdAndDayOfWeek(eq(userId), eq(DayOfWeekEnum.MON))).thenReturn(List.of(slot1));
        when(attendanceLogRepository.findAllByUserIdAndLogDateAndDeletedAtIsNull(eq(userId), eq(todayDate))).thenReturn(List.of());

        // Current time is 10:30 -> after Math slot ended
        TodayResponse response = todayService.getTodaySummary(userId, todayDate, LocalTime.of(10, 30));

        assertEquals(ScheduleStateEnum.FINISHED, response.getScheduleState());
        assertNull(response.getCurrentClass());
        assertEquals(1, response.getCompletedClasses().size());
    }
}
