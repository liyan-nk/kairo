package com.kairo.backend.controller;

import com.kairo.backend.dto.request.ClaimRequest;
import com.kairo.backend.dto.request.CreateLostFoundRequest;
import com.kairo.backend.dto.response.ClaimResponse;
import com.kairo.backend.dto.response.LostFoundResponse;
import com.kairo.backend.security.UserPrincipal;
import com.kairo.backend.service.LostFoundService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/campus/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @GetMapping
    public ResponseEntity<List<LostFoundResponse>> getActiveLostFoundItems(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<LostFoundResponse> items = lostFoundService.getActiveItems();
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<LostFoundResponse> submitLostFoundItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateLostFoundRequest request
    ) {
        LostFoundResponse response = lostFoundService.submitItem(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/claim")
    public ResponseEntity<ClaimResponse> claimLostFoundItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("id") UUID itemId,
            @Valid @RequestBody ClaimRequest request
    ) {
        ClaimResponse response = lostFoundService.claimItem(principal.getId(), itemId, request.getAnswer());
        return ResponseEntity.ok(response);
    }
}
