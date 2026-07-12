package org.example.dataBase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, Integer> {
    List<Messages> findBySenderId(int senderId);
    List<Messages> findByRecipientId(int recipientId);

}