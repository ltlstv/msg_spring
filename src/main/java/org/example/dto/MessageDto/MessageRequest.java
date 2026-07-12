package org.example.dto.MessageDto;

public record MessageRequest(
        String recipientUser,
        String message
) {}
