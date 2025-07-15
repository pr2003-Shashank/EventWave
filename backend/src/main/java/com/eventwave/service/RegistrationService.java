package com.eventwave.service;

import com.eventwave.dto.AttendeeDTO;
import com.eventwave.dto.AttendeeSummaryDTO;
import com.eventwave.dto.RegistrationResponseDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.*;
import com.eventwave.repository.EventRepository;
import com.eventwave.repository.RegistrationRepository;
import com.eventwave.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;

    @Transactional
    public RegistrationResponseDTO registerForEvent(Long eventId, String userEmail) {
        Event event = eventRepository.findByIdWithLock(eventId)
                .orElseThrow(() -> new ApiException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        if (registrationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new ApiException("User already registered for this event");
        }

        if (registrationRepository.findByEvent(event).size() >= event.getCapacity()) {
            throw new ApiException("Event is at full capacity");
        }
        
        // Email for registration success
        String subject = "Successfully Registered for: " + event.getTitle();
        String body = "Dear " + user.getFullName() + ",\n\n"
                + "You have successfully registered for, \n" + event.getTitle() 
                + "\nOrganized by " + event.getOrganizer().getFullName() 
                + "\nscheduled on " + event.getDate() + "\n\n"
                + "Thanks,\nEventWave Team";

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setStatus("CONFIRMED");
        registration.setRegisteredAt(LocalDateTime.now());

        Registration saved = registrationRepository.save(registration);
        
        //send mail
        emailService.sendSimpleEmail(user.getEmail(), subject, body); 

        return new RegistrationResponseDTO("success", "Registration successful", saved.getId(), saved.getRegisteredAt());
    }


    public String unregisterFromEvent(Long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        Registration registration = registrationRepository.findByEventAndUser(event, user)
                .orElseThrow(() -> new ApiException("User not registered for this event"));

        registrationRepository.delete(registration);
        return "Successfully unregistered";
    }


    public List<AttendeeDTO> getAttendeesForEvent(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("ERROR", "Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new ApiException("FORBIDDEN", "You are not allowed to view attendees of this event");
        }

        List<Registration> registrations = registrationRepository.findByEvent(event);

        return registrations.stream()
                .map(r -> {
                    User attendee = r.getUser();
                    return new AttendeeDTO(attendee.getId(), attendee.getUsername(), attendee.getEmail(), attendee.getFullName());
                })
                .toList();
    }
    
    public AttendeeSummaryDTO getAttendeeSummary(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new ApiException("FORBIDDEN", "You are not allowed to view this event's summary");
        }

        int registered = registrationRepository.findByEvent(event).size();
        int capacity = event.getCapacity();
        int available = Math.max(0, capacity - registered);

        return new AttendeeSummaryDTO(event.getId(), event.getTitle(), capacity, registered, available);
    }

}
