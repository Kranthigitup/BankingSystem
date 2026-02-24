package com.bank.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final long expirationMinutes;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-minutes}") long expirationMinutes) {
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(String subject, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claim("sub", subject) // Explicitly set sub claim as well
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateTokenWithExpiration(String subject, String role, long minutes) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(minutes, ChronoUnit.MINUTES)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractRole(String token) {
        Object role = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
        return role == null ? null : role.toString();
    }

    public String extractSubject(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes;
        if (secret.startsWith("base64:")) {
            keyBytes = Decoders.BASE64.decode(secret.substring("base64:".length()));
        } else {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
