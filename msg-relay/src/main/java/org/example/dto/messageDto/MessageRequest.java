package org.example.dto.messageDto;

public record MessageRequest(
        String recipientUser,
        String message
) {}
