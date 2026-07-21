package com.kairo.backend.service;

import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.entity.*;
import com.kairo.backend.repository.TimetableSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TimetableServiceUnitTest {

    @Mock
    private TimetableSlotRepository timetableSlotRepository;

    private TimetableService timetableService;

    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        timetableService = new TimetableService(timetableSlotRepository);
    }

    @Test
    @DisplayName("getWeeklyTimetable should map timetable slots and fallback to course room/faculty")
    void getWeeklyTimetable_Success() {
        CourseEntity course = CourseEntity.builder()
                .id(UUID.randomUUID())
                .name("Algorithms")
                .room("301")
                .faculty("Dr. Turing")
                .build();

        EnrollmentEntity enrollment = EnrollmentEntity.builder()
                .course(course)
                .build();

        TimetableSlotEntity slot = TimetableSlotEntity.builder()
                .id(UUID.randomUUID())
                .enrollment(enrollment)
                .dayOfWeek(DayOfWeekEnum.MON)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(10, 0))
                .build();

        when(timetableSlotRepository.findAllByUserId(userId)).thenReturn(List.of(slot));

        List<TimetableSlotResponse> responses = timetableService.getWeeklyTimetable(userId);

        assertEquals(1, responses.size());
        TimetableSlotResponse res = responses.get(0);
        assertEquals("301", res.getRoom());
        assertEquals("Dr. Turing", res.getFaculty());
        assertEquals("Algorithms", res.getSubjectName());
    }
}
