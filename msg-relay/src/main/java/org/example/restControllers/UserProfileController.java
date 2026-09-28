package org.example.restControllers;

import lombok.RequiredArgsConstructor;
import org.example.dto.messageDto.MessageResponse;
import org.example.dto.userDto.UserResponse;
import org.example.services.ProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileService profileService;

    @GetMapping
    public UserResponse getProfile() {
        return profileService.getUserProfile();
    }

//    @PutMapping
//    public MessageResponse updateProfile() {}

    @PostMapping("/avatar")
    public MessageResponse uploadAvatar(@RequestParam("file") MultipartFile file) {
        String avatarUrl = profileService.uploadAvatar(file);
        return new MessageResponse.Text(avatarUrl);
    }

    @DeleteMapping("/avatar")
    public MessageResponse deleteAvatar() {
        profileService.deleteAvatar();
        return new MessageResponse.Text("Avatar deleted");
    }
    
}
