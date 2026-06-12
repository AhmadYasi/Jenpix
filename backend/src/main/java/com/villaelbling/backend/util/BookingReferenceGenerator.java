package com.villaelbling.backend.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class BookingReferenceGenerator {
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Generates a reference in the format VE-XXXXXX
     * e.g. VE-A3K9PQ
     */
    public String generate() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return "VE-" + sb;
    }
}
