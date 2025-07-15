package com.eventwave.service;

import com.eventwave.dto.AttendeeSummaryDTO;
import com.eventwave.dto.RegistrationResponseDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.Event;
import com.eventwave.model.Registration;
import com.eventwave.model.User;
import com.eventwave.repository.EventRepository;
import com.eventwave.repository.RegistrationRepository;
import com.eventwave.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RegistrationServiceTest {

    @InjectMocks
    private RegistrationService registrationService;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ==================== registerForEvent ======================

    @Test
    void testRegisterForEvent_Success() {
        Long eventId = 1L;
        String userEmail = "user@example.com";

        Event event = new Event();
        event.setId(eventId);
        event.setCapacity(2);

        User user = new User();
        user.setEmail(userEmail);

        Registration saved = new Registration();
        saved.setId(100L);
        saved.setRegisteredAt(LocalDateTime.now());

        when(eventRepository.findByIdWithLock(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(registrationRepository.findByEventAndUser(event, user)).thenReturn(Optional.empty());
        when(registrationRepository.findByEvent(event)).thenReturn(Collections.singletonList(new Registration()));
        when(registrationRepository.save(any(Registration.class))).thenReturn(saved);

        RegistrationResponseDTO response = registrationService.registerForEvent(eventId, userEmail);

        assertNotNull(response);
        assertEquals("success", response.getStatus());
        assertEquals("Registration successful", response.getMessage());
        assertEquals(saved.getId(), response.getRegistrationId());
    }

    @Test
    void testRegister_UserAlreadyRegistered() {
        Long eventId = 1L;
        String userEmail = "user@example.com";

        Event event = new Event();
        User user = new User();

        when(eventRepository.findByIdWithLock(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(registrationRepository.findByEventAndUser(event, user)).thenReturn(Optional.of(new Registration()));

        ApiException ex = assertThrows(ApiException.class, () -> {
            registrationService.registerForEvent(eventId, userEmail);
        });

        assertEquals("User already registered for this event", ex.getMessage());
    }

    @Test
    void testRegister_EventFull() {
        Long eventId = 1L;
        String userEmail = "user@example.com";

        Event event = new Event();
        event.setCapacity(1);
        User user = new User();

        when(eventRepository.findByIdWithLock(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(registrationRepository.findByEventAndUser(event, user)).thenReturn(Optional.empty());
        when(registrationRepository.findByEvent(event)).thenReturn(List.of(new Registration(), new Registration()));

        ApiException ex = assertThrows(ApiException.class, () -> {
            registrationService.registerForEvent(eventId, userEmail);
        });

        assertEquals("Event is at full capacity", ex.getMessage());
    }

    @Test
    void testRegister_EventNotFound() {
        when(eventRepository.findByIdWithLock(1L)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                registrationService.registerForEvent(1L, "test@example.com"));

        assertEquals("Event not found", ex.getMessage());
    }

    @Test
    void testRegister_UserNotFound() {
        Event event = new Event();
        when(eventRepository.findByIdWithLock(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail("email@example.com")).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                registrationService.registerForEvent(1L, "email@example.com"));

        assertEquals("User not found", ex.getMessage());
    }

    // ==================== unregisterFromEvent ======================

    @Test
    void testUnregister_Success() {
        Event event = new Event();
        User user = new User();
        Registration registration = new Registration();

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(registrationRepository.findByEventAndUser(event, user)).thenReturn(Optional.of(registration));

        String result = registrationService.unregisterFromEvent(1L, "test@example.com");

        assertEquals("Successfully unregistered", result);
        verify(registrationRepository).delete(registration);
    }

    @Test
    void testUnregister_EventNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                registrationService.unregisterFromEvent(1L, "email@example.com"));

        assertEquals("Event not found", ex.getMessage());
    }

    @Test
    void testUnregister_UserNotRegistered() {
        Event event = new Event();
        User user = new User();

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail("email@example.com")).thenReturn(Optional.of(user));
        when(registrationRepository.findByEventAndUser(event, user)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                registrationService.unregisterFromEvent(1L, "email@example.com"));

        assertEquals("User not registered for this event", ex.getMessage());
    }

    // ==================== getAttendeesForEvent ======================

    @Test
    void testGetAttendees_UnauthorizedOrganizer() {
        Event event = new Event();
        User organizer = new User();
        organizer.setEmail("org@abc.com");
        event.setOrganizer(organizer);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        ApiException ex = assertThrows(ApiException.class, () ->
                registrationService.getAttendeesForEvent(1L, "fake@abc.com"));

        assertEquals("You are not allowed to view attendees of this event", ex.getMessage());
    }

    @Test
    void testGetAttendeeSummary_Success() {
        Event event = new Event();
        event.setId(1L);
        event.setCapacity(100);
        event.setTitle("Test Event");

        User organizer = new User();
        organizer.setEmail("org@abc.com");
        event.setOrganizer(organizer);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(registrationRepository.findByEvent(event)).thenReturn(List.of(new Registration(), new Registration()));

        AttendeeSummaryDTO summary = registrationService.getAttendeeSummary(1L, "org@abc.com");

        assertEquals(2, summary.getRegistered());
        assertEquals(98, summary.getAvailableSpots());
        assertEquals(100, summary.getCapacity());
        assertEquals("Test Event", summary.getTitle());
        assertEquals(1L, summary.getEventId());
    }

}
