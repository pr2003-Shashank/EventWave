package com.eventwave.controller;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.AttendeeDTO;
import com.eventwave.dto.AttendeeSummaryDTO;
import com.eventwave.dto.EventRegistrationRequest;
import com.eventwave.dto.RegistrationResponseDTO;
import com.eventwave.service.RegistrationService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDTO> register(
            @RequestBody @Valid EventRegistrationRequest request,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {

        String email = userDetails.getUsername();
        RegistrationResponseDTO response = registrationService.registerForEvent(request.getEventId(), email);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/unregister")
    public ResponseEntity<ApiResponse> unregister(
            @RequestParam Long eventId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {

        String email = userDetails.getUsername(); // JWT → email
        String message = registrationService.unregisterFromEvent(eventId, email);
        return ResponseEntity.ok(new ApiResponse("success", message));
    }


    @GetMapping("/attendees/{eventId}")
    public ResponseEntity<List<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {

        String organizerEmail = userDetails.getUsername(); // JWT -> UserDetails email
        List<AttendeeDTO> attendees = registrationService.getAttendeesForEvent(eventId, organizerEmail);
        return ResponseEntity.ok(attendees);
    }

    @GetMapping("/summary/{eventId}")
    public ResponseEntity<AttendeeSummaryDTO> getEventSummary(
            @PathVariable Long eventId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {

        String organizerEmail = userDetails.getUsername();
        AttendeeSummaryDTO summary = registrationService.getAttendeeSummary(eventId, organizerEmail);
        return ResponseEntity.ok(summary);
    }

}
