package org.example.services;

import org.example.dataBase.UserRepository;
import org.example.dataBase.Users;
import org.example.dto.userDto.UserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final Path uploadDirectory;
    private static final long MAX_SIZE = 8 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png");

    public ProfileService(UserRepository userRepository, @Value("${app.avatar-dir}") String avatarDir) {
        this.userRepository = userRepository;
        this.uploadDirectory = Paths.get(avatarDir).toAbsolutePath().normalize();
    }

    @Transactional
    public String uploadAvatar(MultipartFile file) {
        validate(file);

        Users user = currentUser();
        String previous = user.getAvatarUrlId();

        try {
            Files.createDirectories(uploadDirectory);

            String fileName = UUID.randomUUID() + extensionFor(file.getContentType());
            Path target = uploadDirectory.resolve(fileName).normalize();

            if (!target.startsWith(uploadDirectory)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }

            user.setAvatarUrlId(fileName);
            userRepository.save(user);

            deleteFileQuietly(previous);

            return buildAvatarUrl(fileName);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store avatar", e);
        }
    }

    @Transactional
    public void deleteAvatar() {
        Users user = currentUser();
        String current = user.getAvatarUrlId();

        if (current == null) {
            return;
        }

        user.setAvatarUrlId(null);
        userRepository.save(user);

        deleteFileQuietly(current);
    }

    public UserResponse getUserProfile() {
        Users user = currentUser();

        return new UserResponse(user.getUsername(), buildAvatarUrl(user.getAvatarUrlId()));
    }

    private String buildAvatarUrl(String fileName) {
        if (fileName == null) {
            return null;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/avatars/")
                .path(fileName)
                .toUriString();
    }

    private Users currentUser() {
        Users principal = (Users) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User no longer exists"));
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file uploaded");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Avatar must be 8 MB or smaller");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Only JPEG or PNG is allowed");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            default -> ".jpg";
        };
    }

    private void deleteFileQuietly(String fileName) {
        if (fileName == null) {
            return;
        }
        try {
            Files.deleteIfExists(uploadDirectory.resolve(fileName).normalize());
        } catch (IOException ignored) {}
    }
}
