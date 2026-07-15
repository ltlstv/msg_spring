package org.example.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtill {

    //убрать от сюда
    private final Key key = Keys.hmacShaKeyFor(
            "SECRET_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX".getBytes()
    );

    private static final long EXPIRATION_TIME = 1000 * 60 * 5;

    public String generateToken(String username, int userId) {
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public int getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.get("userId", Integer.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}