package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.BlockedDateRequest;
import com.villaelbling.backend.dto.response.BlockedDateResponse;
import com.villaelbling.backend.service.BlockedDateService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/blocked-dates")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminBlockedDateController {

    private final BlockedDateService blockedDateService;

    @GetMapping
    public ResponseEntity<List<BlockedDateResponse>> getAllBlocked(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(blockedDateService.getAllBlocked(from, to));
    }

    @PostMapping
    public ResponseEntity<BlockedDateResponse> blockDates(
            @Valid @RequestBody BlockedDateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blockedDateService.blockDates(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unblock(@PathVariable UUID id) {
        blockedDateService.unblock(id);
        return ResponseEntity.noContent().build();
    }
}
