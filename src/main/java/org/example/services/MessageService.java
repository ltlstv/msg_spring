package org.example.services;

import lombok.RequiredArgsConstructor;
import org.example.auxiliaryServices.JwtUtill;
import org.example.dataBase.Messages;
import org.example.dataBase.MessagesRepository;
import org.example.dataBase.User;
import org.example.dataBase.UserRepository;
import org.example.dto.MessageDto.MessageItem;
import org.example.dto.MessageDto.MessageRequest;
import org.example.dto.MessageDto.MessageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessagesRepository messagesRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse save(MessageRequest messageRequest, String token) {
        int userId = JwtUtill.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return new MessageResponse.Text("User not found");
        }

        messagesRepository.save(Messages.builder().user(user).message(messageRequest.message()).build());

        return new MessageResponse.Text("Message saved successfully");
    }

    @Transactional(readOnly = true)
    public MessageResponse getAllUserMessages(String token) {
        int userId = JwtUtill.getUserIdFromToken(token);

        return new MessageResponse.MessageList(messagesRepository.findByUserId(userId).stream().map(MessageItem::from).toList());
    }

}
