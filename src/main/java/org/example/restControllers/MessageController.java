package org.example.restControllers;

import lombok.RequiredArgsConstructor;
import org.example.dto.MessageDto.MessageRequest;
import org.example.dto.MessageDto.MessageResponse;
import org.example.services.MessageService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public MessageResponse newMessage(@RequestBody MessageRequest messageRequest, @RequestHeader("Authorization") String authHeader) {
        return messageService.sendToUser(messageRequest, authHeader.substring(7));
    }

    @GetMapping("/read")
    public MessageResponse readMessages(@RequestHeader("Authorization") String authHeader) {
        return messageService.getAllReceivedMessages(authHeader.substring(7));
    }

}

