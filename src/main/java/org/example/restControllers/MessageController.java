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

    @PostMapping("/new")
    public MessageResponse newMessage(@RequestBody MessageRequest messageRequest, @RequestHeader("Authorization") String authHeader) {
        return messageService.save(messageRequest, authHeader.substring(7));
    }

    @GetMapping("/all")
    public MessageResponse getAllMessages(@RequestHeader("Authorization") String authHeader) {
        return messageService.getAllUserMessages(authHeader.substring(7));
    }

}

