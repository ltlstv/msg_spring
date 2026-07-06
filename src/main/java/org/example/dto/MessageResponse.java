package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.example.dataBase.Messages;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String message;
    private Messages singleMessage;
    private List<AllMessages> allMessages;
}
