package com.eventwave.dto;

import java.time.LocalDateTime;

public class RegistrationResponseDTO {

    private String status;
    private String message;
    private Long registrationId;
    private LocalDateTime registeredAt;

    public RegistrationResponseDTO(String status, String message, Long registrationId, LocalDateTime registeredAt) {
        this.status = status;
        this.message = message;
        this.registrationId = registrationId;
        this.registeredAt = registeredAt;
    }

    // Getters
    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }
}
