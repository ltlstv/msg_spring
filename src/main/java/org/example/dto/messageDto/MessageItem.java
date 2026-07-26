package org.example.dto.messageDto;

import org.example.dataBase.Messages;

import java.time.Instant;

public record MessageItem(
        Integer id,
        String message,
        String sender,
        Instant sentAt
) {
    public static MessageItem from(Messages m) {
        return new MessageItem(
                m.getId(),
                m.getMessage(),
                m.getSender().getUsername(),
                m.getSentAt()
        );
    }
}
