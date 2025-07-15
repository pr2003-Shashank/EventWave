package com.eventwave.service;

import com.eventwave.dto.ReviewRequestDTO;
import com.eventwave.dto.ReviewResponseDTO;
import com.eventwave.dto.ReviewStatsDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.Event;
import com.eventwave.model.Review;
import com.eventwave.model.User;
import com.eventwave.repository.EventRepository;
import com.eventwave.repository.RegistrationRepository;
import com.eventwave.repository.ReviewRepository;
import com.eventwave.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private RegistrationRepository registrationRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    public void addReview(String email, ReviewRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ApiException("Event not found"));

        if (event.getEndTime().isAfter(LocalTime.now())) {
            throw new ApiException("You can only review past events");
        }

        boolean isRegistered = registrationRepository.findByEvent(event).stream()
                .anyMatch(r -> r.getUser().getId().equals(user.getId()) && r.getStatus().equals("CONFIRMED"));

        if (!isRegistered) {
            throw new ApiException("Only registered attendees can review");
        }

        if (reviewRepository.findByUserAndEvent(user, event).isPresent()) {
            throw new ApiException("You have already reviewed this event");
        }

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);
    }

    public void updateReview(String email, Long reviewId, ReviewRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ApiException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new ApiException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);
    }

    public void deleteReview(String email, Long reviewId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ApiException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new ApiException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    public List<ReviewResponseDTO> getReviewsForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("Event not found"));

        return reviewRepository.findByEvent(event).stream()
                .map(r -> new ReviewResponseDTO(
                        r.getId(),
                        r.getEvent().getId(),
                        r.getEvent().getTitle(),
                        r.getUser().getFullName(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt()
                )).collect(Collectors.toList());
    }
    
    public Page<ReviewResponseDTO> getFilteredReviews(Long eventId, int minRating, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviewPage = reviewRepository.findByEventIdAndRatingGreaterThanEqual(eventId, minRating, pageable);

        return reviewPage.map(r -> new ReviewResponseDTO(
                r.getId(),
                r.getEvent().getId(),
                r.getEvent().getTitle(),
                r.getUser().getFullName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        ));
    }
    
    public ReviewStatsDTO getReviewStatsForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("Event not found"));

        List<Review> reviews = reviewRepository.findByEvent(event);

        if (reviews.isEmpty()) {
            return new ReviewStatsDTO(0.0, 0, Map.of(1, 0L, 2, 0L, 3, 0L, 4, 0L, 5, 0L));
        }

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> breakdown = reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));

        // Ensure all 1–5 stars are included even if count is 0
        for (int i = 1; i <= 5; i++) {
            breakdown.putIfAbsent(i, 0L);
        }

        return new ReviewStatsDTO(average, reviews.size(), breakdown);
    }

}
