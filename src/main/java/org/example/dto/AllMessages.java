package org.example.dto;

import lombok.*;
import org.example.dataBase.Messages;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllMessages {
    private Integer id;
    private String message;
    private String username;

    public AllMessages(Messages m) {
        this.id = m.getId();
        this.message = m.getMessage();
        this.username = m.getUser().getUsername();
    }
}
