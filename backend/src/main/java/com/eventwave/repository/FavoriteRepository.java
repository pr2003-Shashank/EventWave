package com.eventwave.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventwave.model.Event;
import com.eventwave.model.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    Optional<Favorite> findByUserIdAndEventId(Long userId, Long eventId);
    List<Favorite> findByUserId(Long userId);
    void deleteByEvent(Event event);

}
