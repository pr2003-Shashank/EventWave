package com.eventwave.controller;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.ReviewRequestDTO;
import com.eventwave.dto.ReviewResponseDTO;
import com.eventwave.dto.ReviewStatsDTO;
import com.eventwave.service.ReviewService;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse> addReview(@RequestBody ReviewRequestDTO request, Authentication auth) {
        String email = auth.getName();
        reviewService.addReview(email, request);
        return ResponseEntity.ok(new ApiResponse("success", "Review submitted successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateReview(@PathVariable Long id,
                                                    @RequestBody ReviewRequestDTO request,
                                                    Authentication auth) {
        String email = auth.getName();
        reviewService.updateReview(email, id, request);
        return ResponseEntity.ok(new ApiResponse("success", "Review updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        reviewService.deleteReview(email, id);
        return ResponseEntity.ok(new ApiResponse("success", "Review deleted successfully"));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviews(@PathVariable Long eventId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsForEvent(eventId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Page<ReviewResponseDTO>> getFilteredReviews(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "1") int minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ReviewResponseDTO> reviews = reviewService.getFilteredReviews(eventId, minRating, page, size);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/summary/{eventId}")
    public ResponseEntity<ReviewStatsDTO> getReviewStats(@PathVariable Long eventId) {
        ReviewStatsDTO stats = reviewService.getReviewStatsForEvent(eventId);
        return ResponseEntity.ok(stats);
    }


}
