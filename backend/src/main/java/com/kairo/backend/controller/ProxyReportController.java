package com.kairo.backend.controller;

import com.kairo.backend.dto.request.CreateProxyReportRequest;
import com.kairo.backend.dto.response.ProxyReportResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.ProxyReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/campus/proxy-reports")
public class ProxyReportController {

    private final ProxyReportService proxyReportService;

    public ProxyReportController(ProxyReportService proxyReportService) {
        this.proxyReportService = proxyReportService;
    }

    @GetMapping
    public ResponseEntity<List<ProxyReportResponse>> getActiveProxyReports(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProxyReportResponse> reports = proxyReportService.getActiveReports(LocalDate.now());
        return ResponseEntity.ok(reports);
    }

    @PostMapping
    public ResponseEntity<ProxyReportResponse> submitProxyReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProxyReportRequest request
    ) {
        ProxyReportResponse response = proxyReportService.submitReport(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ProxyReportResponse> confirmProxyReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID reportId
    ) {
        ProxyReportResponse response = proxyReportService.confirmReport(principal.getId(), reportId);
        return ResponseEntity.ok(response);
    }
}
