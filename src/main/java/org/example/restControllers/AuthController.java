package org.example.restControllers;

import lombok.RequiredArgsConstructor;
import org.example.dto.authDto.AuthRequest;
import org.example.dto.authDto.AuthResponse;
import org.example.services.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest authRequest) {
        return authService.register(authRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest);
    }

}
