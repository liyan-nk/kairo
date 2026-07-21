package com.kairo.backend.controller;

import com.kairo.backend.dto.response.TodayResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.TodayService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/v1/today")
public class TodayController {

    private final TodayService todayService;

    public TodayController(TodayService todayService) {
        this.todayService = todayService;
    }

    @GetMapping
    public ResponseEntity<TodayResponse> getToday(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        TodayResponse today = todayService.getTodaySummary(principal.getId(), queryDate, currentTime);
        return ResponseEntity.ok(today);
    }
}
