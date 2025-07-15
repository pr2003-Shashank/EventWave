package com.eventwave.dto;

import jakarta.validation.constraints.NotNull;

public class EventRegistrationRequest {

    @NotNull
    private Long eventId;

    // No userId field!

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
