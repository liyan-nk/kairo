package com.kairo.backend.service;

import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.entity.DayOfWeekEnum;
import com.kairo.backend.entity.TimetableSlotEntity;
import com.kairo.backend.mapper.TimetableMapper;
import com.kairo.backend.repository.TimetableSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TimetableService {

    private final TimetableSlotRepository timetableSlotRepository;

    public TimetableService(TimetableSlotRepository timetableSlotRepository) {
        this.timetableSlotRepository = timetableSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<TimetableSlotResponse> getWeeklyTimetable(UUID userId) {
        List<TimetableSlotEntity> slots = timetableSlotRepository.findAllByUserId(userId);
        return slots.stream()
                .map(TimetableMapper::toTimetableSlotResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TimetableSlotResponse> getDailyTimetable(UUID userId, DayOfWeekEnum dayOfWeek) {
        List<TimetableSlotEntity> slots = timetableSlotRepository.findAllByUserIdAndDayOfWeek(userId, dayOfWeek);
        return slots.stream()
                .map(TimetableMapper::toTimetableSlotResponse)
                .toList();
    }
}
