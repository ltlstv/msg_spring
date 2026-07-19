package org.example.dto.MessageDto;

import org.example.dataBase.Messages;
import java.util.List;

public sealed interface MessageResponse {

    record Text(String value) implements MessageResponse {}
    record SingleMessage(MessageItem message) implements MessageResponse {}
    record MessageList(List<MessageItem> messages) implements MessageResponse {}
}