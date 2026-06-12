package com.villaelbling.backend.controller;

import com.villaelbling.backend.dto.request.LoginRequest;
import com.villaelbling.backend.dto.response.LoginResponse;
import com.villaelbling.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String userAgent = httpRequest.getHeader("User-Agent");
        return ResponseEntity.ok(authService.login(request, userAgent));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7));
        }
        return ResponseEntity.noContent().build();
    }
}
