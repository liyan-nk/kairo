package com.kairo.backend.controller;

import com.kairo.backend.dto.response.TimetableSlotResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetable-slots")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public ResponseEntity<List<TimetableSlotResponse>> getWeeklyTimetable(@AuthenticationPrincipal UserPrincipal principal) {
        List<TimetableSlotResponse> timetable = timetableService.getWeeklyTimetable(principal.getId());
        return ResponseEntity.ok(timetable);
    }
}
