package com.eventwave.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import static org.junit.jupiter.api.Assertions.assertThrows;
import io.jsonwebtoken.ExpiredJwtException;


import java.security.Key;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    public void setUp() {
        jwtService = new JwtService();
    }

    @Test
    public void testGenerateAndExtractUsername() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertEquals(email, jwtService.extractUsername(token));
    }

    @Test
    public void testTokenValidity_ValidToken() {
        String email = "validuser@example.com";
        String token = jwtService.generateToken(email);

        User user = new User(email, "password", Collections.emptyList());

        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    public void testTokenValidity_InvalidToken() {
        String email = "user1@example.com";
        String token = jwtService.generateToken(email);

        User otherUser = new User("other@example.com", "password", Collections.emptyList());

        assertFalse(jwtService.isTokenValid(token, otherUser));
    }

    @Test
    public void testTokenIsNotExpiredImmediately() {
        String email = "user2@example.com";
        String token = jwtService.generateToken(email);

        assertFalse(jwtService.isTokenExpired(token)); // Should not be expired right away
    }

    @Test
    public void testExpiredTokenReturnsTrue() {
        String email = "expired@example.com";
        String secretKey = "u7zR8B1sZNRLMwpnHbxEvkW4bD3I9kT3EFSYX4yQX6g=";
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        Key key = Keys.hmacShaKeyFor(keyBytes);

        // Set expiration time in the past
        Date issuedAt = new Date(System.currentTimeMillis() - 20 * 60 * 1000); // 20 mins ago
        Date expiration = new Date(System.currentTimeMillis() - 10 * 60 * 1000); // 10 mins ago

        String expiredToken = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Assert that expired token throws ExpiredJwtException
        assertThrows(ExpiredJwtException.class, () -> {
            jwtService.isTokenExpired(expiredToken);
        });
    }
}
