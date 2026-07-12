package org.example.dto.MessageDto;

import org.example.dataBase.Messages;

public record MessageItem(
        Integer id,
        String message,
        String sender
) {
    public static MessageItem from(Messages m) {
        return new MessageItem(
                m.getId(),
                m.getMessage(),
                m.getSender().getUsername()
        );
    }
}