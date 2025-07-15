package com.eventwave.dto;

import java.time.LocalDateTime;

public class ReviewResponseDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String reviewerName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    // Constructor
    public ReviewResponseDTO(Long id, Long eventId, String eventTitle, String reviewerName,
                             int rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.reviewerName = reviewerName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getEventId() {
		return eventId;
	}

	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}

	public String getEventTitle() {
		return eventTitle;
	}

	public void setEventTitle(String eventTitle) {
		this.eventTitle = eventTitle;
	}

	public String getReviewerName() {
		return reviewerName;
	}

	public void setReviewerName(String reviewerName) {
		this.reviewerName = reviewerName;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    
    // Getters
}
