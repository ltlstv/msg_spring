package org.example.restControllers;

import lombok.RequiredArgsConstructor;
import org.example.dto.messageDto.MessageRequest;
import org.example.dto.messageDto.MessageResponse;
import org.example.services.MessageService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

//    @PostMapping("/send")
//    public MessageResponse newMessage(@RequestBody MessageRequest messageRequest) {
//        return messageService.sendToUser(messageRequest);
//    }

    @GetMapping("/get-message-history")
    public MessageResponse readMessages() {
        return messageService.getAllChatMessages();
    }

}

