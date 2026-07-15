package org.example.services;

import lombok.RequiredArgsConstructor;
import org.example.Security.JwtUtill;
import org.example.dataBase.Messages;
import org.example.dataBase.MessagesRepository;
import org.example.dataBase.User;
import org.example.dataBase.UserRepository;
import org.example.dto.MessageDto.MessageItem;
import org.example.dto.MessageDto.MessageRequest;
import org.example.dto.MessageDto.MessageResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessagesRepository messagesRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse sendToUser(MessageRequest messageRequest) {
        User userSender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User userReceiver = userRepository.findByUsername(messageRequest.recipientUser()).orElse(null);

        if (userReceiver == null) {
            return new MessageResponse.Text("Receiver user not found");
        }

        messagesRepository.save(Messages.builder().sender(userSender).recipient(userReceiver).message(messageRequest.message()).build());

        return new MessageResponse.Text("Message send successfully");
    }

    @Transactional(readOnly = true)
    public MessageResponse getAllReceivedMessages() {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        List<MessageItem> receivedMessages = messagesRepository.findByRecipientId(currentUser.getId()).stream().map(MessageItem::from).toList();

        if (receivedMessages.isEmpty()) {
            return new MessageResponse.Text("You have no incoming messages");
        } else {
            return new MessageResponse.MessageList(receivedMessages);
        }
    }
}
