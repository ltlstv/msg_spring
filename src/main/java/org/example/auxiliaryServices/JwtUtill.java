package org.example.auxiliaryServices;

import io.jsonwebtoken.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtill {

    private static final Key key = Keys.hmacShaKeyFor(
            "SECRET_KEY_XXXXXXXXXXXXXXXXXXXXXXXXXXXX".getBytes()
    );

    private static final long EXPIRATION_TIME = 1000 * 60 * 5;

    public static String generateToken(String username, int userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static Jws<Claims> verifyToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

    public static int getUserIdFromToken(String token) {
        try {
            Jws<Claims> claims = verifyToken(token);
            return claims.getBody().get("userId", Integer.class);
        } catch (Exception e) {
            throw new RuntimeException("Неверный токен", e);
        }
    }
}
