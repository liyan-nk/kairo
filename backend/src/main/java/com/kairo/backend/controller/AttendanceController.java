package com.kairo.backend.controller;

import com.kairo.backend.dto.request.MarkAttendanceRequest;
import com.kairo.backend.dto.request.UpdateAttendanceRequest;
import com.kairo.backend.dto.response.AttendanceLogResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/attendance-logs")
    public ResponseEntity<AttendanceLogResponse> markAttendance(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MarkAttendanceRequest request
    ) {
        AttendanceLogResponse response = attendanceService.markAttendance(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/courses/{id}/attendance-logs")
    public ResponseEntity<List<AttendanceLogResponse>> getCourseAttendanceLogs(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID courseId
    ) {
        List<AttendanceLogResponse> logs = attendanceService.getCourseAttendanceLogs(principal.getId(), courseId);
        return ResponseEntity.ok(logs);
    }

    @PutMapping("/attendance-logs/{id}")
    public ResponseEntity<AttendanceLogResponse> updateAttendance(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID logId,
            @Valid @RequestBody UpdateAttendanceRequest request
    ) {
        AttendanceLogResponse response = attendanceService.updateAttendance(principal.getId(), logId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/attendance-logs/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID logId
    ) {
        attendanceService.deleteAttendance(principal.getId(), logId);
        return ResponseEntity.noContent().build();
    }
}
