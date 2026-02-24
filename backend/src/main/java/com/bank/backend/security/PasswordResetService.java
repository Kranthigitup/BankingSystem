package com.bank.backend.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static class ResetEntry {
        private final String otp;
        private final Instant expiresAt;

        private ResetEntry(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private final SecureRandom random = new SecureRandom();
    private final Map<String, ResetEntry> resets = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        resets.put(email, new ResetEntry(otp, Instant.now().plus(5, ChronoUnit.MINUTES)));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        ResetEntry entry = resets.get(email);
        if (entry == null) {
            return false;
        }
        if (Instant.now().isAfter(entry.expiresAt)) {
            resets.remove(email);
            return false;
        }
        boolean ok = entry.otp.equals(otp);
        if (ok) {
            resets.remove(email);
        }
        return ok;
    }
}
