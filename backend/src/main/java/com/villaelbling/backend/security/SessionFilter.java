package com.villaelbling.backend.security;

import com.villaelbling.backend.entity.Session;
import com.villaelbling.backend.repository.SessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SessionFilter extends OncePerRequestFilter {

    private final SessionRepository sessionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            sessionRepository.findByTokenWithUser(token).ifPresent(session -> {
                // Reject expired sessions
                if (session.getExpiresAt().isAfter(OffsetDateTime.now())) {

                    // Update last used timestamp
                    session.setLastUsedAt(OffsetDateTime.now());
                    sessionRepository.save(session);

                    // Set authentication in security context
                    var user = session.getUser();
                    var auth = new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            });
        }

        filterChain.doFilter(request, response);
    }
}
