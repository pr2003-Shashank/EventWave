package com.eventwave.dto;

import java.util.Map;

public class ReviewStatsDTO {
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> ratingBreakdown; // key: rating (1–5), value: count

    public ReviewStatsDTO(double averageRating, long totalReviews, Map<Integer, Long> ratingBreakdown) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.ratingBreakdown = ratingBreakdown;
    }

    // Getters
    public double getAverageRating() {
        return averageRating;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public Map<Integer, Long> getRatingBreakdown() {
        return ratingBreakdown;
    }

    // Setters
    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public void setRatingBreakdown(Map<Integer, Long> ratingBreakdown) {
        this.ratingBreakdown = ratingBreakdown;
    }
}
