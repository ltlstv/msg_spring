package org.example.webSocket;

import lombok.RequiredArgsConstructor;
import org.example.dataBase.User;
import org.example.dto.messageDto.MessageRequest;
import org.example.services.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat.send")
    public void send(MessageRequest messageRequest, Principal principal) {
        User sender = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

        simpMessagingTemplate.convertAndSendToUser(
                messageRequest.recipientUser(),
                "/queue/messages",
                messageService.sendToUser(sender, messageRequest));
    }
}
