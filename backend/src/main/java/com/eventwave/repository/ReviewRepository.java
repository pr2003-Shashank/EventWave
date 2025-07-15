package com.eventwave.repository;

import com.eventwave.model.Review;
import com.eventwave.model.Event;
import com.eventwave.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByUserAndEvent(User user, Event event);
    List<Review> findByEvent(Event event);
    Page<Review> findByEventIdAndRatingGreaterThanEqual(Long eventId, int rating, Pageable pageable);

}
