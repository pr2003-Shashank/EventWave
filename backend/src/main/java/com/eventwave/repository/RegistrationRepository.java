package com.eventwave.repository;

import com.eventwave.model.Registration;
import com.eventwave.model.User;
import com.eventwave.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByEventAndUser(Event event, User user);
    List<Registration> findByEvent(Event event);
    List<Registration> findByUser(User user);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    int countByEventId(Long eventId);
}
