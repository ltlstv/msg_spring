package org.example.dataBase;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements Serializable, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String hashPassword;

    private String avatarUrl;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Messages> sentMessages;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Messages> receivedMessages;

    @Override
    public String getName() {
        return username;
    }
}