package com.villaelbling.backend.service.impl;

import com.villaelbling.backend.dto.request.LoginRequest;
import com.villaelbling.backend.dto.response.LoginResponse;
import com.villaelbling.backend.entity.Session;
import com.villaelbling.backend.repository.SessionRepository;
import com.villaelbling.backend.repository.UserRepository;
import com.villaelbling.backend.service.AuthService;
import com.villaelbling.backend.util.SessionTokenGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final SessionTokenGenerator tokenGenerator;
    private final PasswordEncoder passwordEncoder;

    private static final int SESSION_HOURS = 8;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request,
                               String userAgent) {

        // 1. Find user
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        // 2. Check active
        if (!user.getIsActive()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Account is disabled");
        }

        // 3. Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // 4. Generate session token
        String token = tokenGenerator.generate();

        // 5. Persist session
        Session session = Session.builder()
                .user(user)
                .token(token)
                .userAgent(userAgent)
                .expiresAt(OffsetDateTime.now().plusHours(SESSION_HOURS))
                .lastUsedAt(OffsetDateTime.now())
                .build();
        sessionRepository.save(session);

        // 6. Update last login
        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public void logout(String token) {
        sessionRepository.findByToken(token)
                .ifPresent(sessionRepository::delete);
    }
}
