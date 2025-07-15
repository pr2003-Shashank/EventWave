package com.eventwave.dto;

public class AttendeeDTO {
    private Long userId;
    private String username;
    private String email;
    private String fullName;

    public AttendeeDTO(Long userId, String username, String email, String fullName) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
    }

    // Getters
    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
    	return username;
    }
    
    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}
