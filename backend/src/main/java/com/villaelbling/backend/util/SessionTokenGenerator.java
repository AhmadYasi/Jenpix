package com.villaelbling.backend.util;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class SessionTokenGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generate() {
        byte[] bytes = new byte[48];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
