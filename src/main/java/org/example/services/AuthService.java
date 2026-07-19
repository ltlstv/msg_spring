package org.example.services;

import lombok.RequiredArgsConstructor;
import org.example.security.JwtUtill;
import org.example.dataBase.User;
import org.example.dataBase.UserRepository;
import org.example.dto.authDto.AuthRequest;
import org.example.dto.authDto.AuthResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtill jwtUtil;

    @Transactional
    public AuthResponse register(AuthRequest authRequest) {
        if (userRepository.findByUsername(authRequest.username()).isPresent()) {
            return new AuthResponse.ErrorMessage("Username is already in use");
        } else {
            User user = User.builder().username(authRequest.username()).hashPassword(authRequest.password()).build();
            userRepository.save(user);
            return new AuthResponse.Token(jwtUtil.generateToken(user.getUsername(), user.getId()));
        }
    }

    public AuthResponse login(AuthRequest authRequest) {
        User user = userRepository.findByUsername(authRequest.username()).orElse(null);
        if (user == null) {
            return new AuthResponse.ErrorMessage("User does not exist");
        } else {
            if (user.getHashPassword().equals(authRequest.password())) {
                return new AuthResponse.Token(jwtUtil.generateToken(user.getUsername(), user.getId()));
            } else {
                return new AuthResponse.ErrorMessage("Wrong Password");
            }
        }
    }

}
