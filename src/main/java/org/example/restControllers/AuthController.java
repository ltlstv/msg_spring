package org.example.restControllers;

import lombok.RequiredArgsConstructor;
import org.example.dto.authDto.AuthRequest;
import org.example.dto.authDto.AuthResponse;
import org.example.services.AuthService;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

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

    @GetMapping("/me")
    public ResponseEntity<String> me(HttpServletRequest request) {
        String result = authService.me(request);

        if (result.equals("error")) {
            return ResponseEntity.internalServerError().body("error");
        }

        return ResponseEntity.ok(result);
    }

}
