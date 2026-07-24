package org.example.dto.authDto;

public sealed interface AuthResponse {

    record Token(String token) implements AuthResponse {}
    record ErrorMessage(String message) implements AuthResponse {}
}
