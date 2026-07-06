package org.example.restControllers;

import org.example.dataBase.Messages;
import org.example.dataBase.MessagesRepository;
import org.example.dataBase.User;
import org.example.dataBase.UserRepository;
import org.example.dto.AllMessages;
import org.example.dto.MessageRequest;
import org.example.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessagesRepository messagesRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/new")
    public MessageResponse newMessage(@RequestBody MessageRequest messageRequest) {
        //оптимизировать
        if (!userRepository.findByUsername(messageRequest.getUsername()).isPresent()) {
            User savedUser = userRepository.save(User.builder().username(messageRequest.getUsername()).build());
            messagesRepository.save(Messages.builder().user(savedUser).message(messageRequest.getMessage()).build());
        } else {
            User existingUser = userRepository.findByUsername(messageRequest.getUsername()).get();
            messagesRepository.save(Messages.builder().user(existingUser).message(messageRequest.getMessage()).build());
        }

        return MessageResponse.builder().message("Сообщение доставлено").build();
    }

    @GetMapping("/all")
    public MessageResponse getAllMessages() {
        return MessageResponse.builder()
                .allMessages(messagesRepository
                                .findAllMessages()
                                .stream()
                                .map(AllMessages::new)
                                .toList()
                ).build();
    }

}

