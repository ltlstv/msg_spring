package org.example.dataBase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, Integer> {
    List<Messages> findByUserId(int userId);
    boolean existsByUserId(int userId);

    @Query("SELECT m FROM Messages m JOIN FETCH m.user")
    List<Messages> findAllMessages();
}
