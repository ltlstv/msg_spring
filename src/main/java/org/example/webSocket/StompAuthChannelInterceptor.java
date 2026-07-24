package org.example.webSocket;

import lombok.RequiredArgsConstructor;
import org.example.dataBase.User;
import org.example.dataBase.UserRepository;
import org.example.security.JwtUtill;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtUtill jwtUtill;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String header = accessor.getFirstNativeHeader("Authorization");

            if (header != null && header.startsWith("Bearer ") && jwtUtill.validateToken(header.substring(7))) {
                int userId = jwtUtill.getUserIdFromToken(header.substring(7));
                User user = userRepository.findById(userId).orElseThrow();

                accessor.setUser(new UsernamePasswordAuthenticationToken(user, null, List.of()));
            }
        }
        return message;
    }
}
