package com.eventwave.dto;

public class AttendeeSummaryDTO {

    private Long eventId;
    private String title;
    private int capacity;
    private int registered;
    private int availableSpots;

    public AttendeeSummaryDTO(Long eventId, String title, int capacity, int registered, int availableSpots) {
        this.eventId = eventId;
        this.title = title;
        this.capacity = capacity;
        this.registered = registered;
        this.availableSpots = availableSpots;
    }

    // Getters
    public Long getEventId() {
        return eventId;
    }

    public String getTitle() {
        return title;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getRegistered() {
        return registered;
    }

    public int getAvailableSpots() {
        return availableSpots;
    }
}
