package org.example.dto.AuthDto;

public sealed interface AuthResponse {

    record Token(String token) implements AuthResponse {}
    record ErrorMessage(String message) implements AuthResponse {}
}
