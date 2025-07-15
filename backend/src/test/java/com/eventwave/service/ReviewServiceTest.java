package com.eventwave.service;

import com.eventwave.dto.ReviewRequestDTO;
import com.eventwave.dto.ReviewResponseDTO;
import com.eventwave.dto.ReviewStatsDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.*;
import com.eventwave.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private EventRepository eventRepository;
    @Mock private RegistrationRepository registrationRepository;
    @Mock private ReviewRepository reviewRepository;

    @InjectMocks private ReviewService reviewService;

    private User user;
    private Event event;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User(); user.setId(1L); user.setEmail("user@example.com");
        event = new Event(); event.setId(1L); event.setDate(LocalDate.now().minusDays(1)); event.setTitle("Test Event");
    }

    @Test
    void testAddReview_Success() {
        ReviewRequestDTO request = new ReviewRequestDTO();
        request.setEventId(1L);
        request.setRating(5);
        request.setComment("Great Event");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(registrationRepository.findByEvent(event)).thenReturn(List.of(createRegistration(user)));
        when(reviewRepository.findByUserAndEvent(user, event)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> reviewService.addReview("user@example.com", request));
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void testAddReview_EventInFuture_Throws() {
        event.setDate(LocalDate.now().plusDays(1));
        ReviewRequestDTO request = new ReviewRequestDTO();
        request.setEventId(1L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        ApiException ex = assertThrows(ApiException.class, () -> reviewService.addReview("user@example.com", request));
        assertEquals("You can only review past events", ex.getMessage());
    }

    @Test
    void testUpdateReview_Success() {
        Review review = new Review(); review.setId(1L); review.setUser(user);
        ReviewRequestDTO request = new ReviewRequestDTO();
        request.setRating(4); request.setComment("Updated");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertDoesNotThrow(() -> reviewService.updateReview("user@example.com", 1L, request));
        verify(reviewRepository).save(review);
    }

    @Test
    void testDeleteReview_Success() {
        Review review = new Review(); review.setId(1L); review.setUser(user);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertDoesNotThrow(() -> reviewService.deleteReview("user@example.com", 1L));
        verify(reviewRepository).delete(review);
    }

    @Test
    void testGetReviewsForEvent() {
        Review review = new Review();
        review.setId(1L);
        review.setRating(5);
        review.setComment("Amazing");
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setEvent(event);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(reviewRepository.findByEvent(event)).thenReturn(List.of(review));

        List<ReviewResponseDTO> response = reviewService.getReviewsForEvent(1L);
        assertEquals(1, response.size());
        assertEquals("Amazing", response.get(0).getComment());
    }

    @Test
    void testGetFilteredReviews() {
        Review review = new Review();
        review.setId(1L);
        review.setRating(4);
        review.setComment("Good");
        review.setUser(user);
        review.setEvent(event);
        review.setCreatedAt(LocalDateTime.now());

        Page<Review> reviewPage = new PageImpl<>(List.of(review));

        when(reviewRepository.findByEventIdAndRatingGreaterThanEqual(eq(1L), eq(3), any(Pageable.class)))
            .thenReturn(reviewPage);

        Page<ReviewResponseDTO> result = reviewService.getFilteredReviews(1L, 3, 0, 10);
        assertEquals(1, result.getTotalElements());
        assertEquals(4, result.getContent().get(0).getRating());
    }

    @Test
    void testGetReviewStatsForEvent_WithReviews() {
        Review r1 = new Review(); r1.setRating(5);
        Review r2 = new Review(); r2.setRating(4);
        Review r3 = new Review(); r3.setRating(4);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(reviewRepository.findByEvent(event)).thenReturn(List.of(r1, r2, r3));

        ReviewStatsDTO stats = reviewService.getReviewStatsForEvent(1L);
        assertEquals(4.33, stats.getAverageRating(), 0.01);
        assertEquals(3, stats.getTotalReviews());
        assertEquals(2L, stats.getRatingBreakdown().get(4));
        assertEquals(1L, stats.getRatingBreakdown().get(5));
        assertEquals(0L, stats.getRatingBreakdown().get(3)); // Unrated stars default to 0
    }

    // Utility method
    private Registration createRegistration(User user) {
        Registration r = new Registration();
        r.setUser(user);
        r.setStatus("CONFIRMED");
        return r;
    }
}
