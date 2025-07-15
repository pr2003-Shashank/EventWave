package com.eventwave.service;

import com.eventwave.dto.*;
import com.eventwave.exception.EmailAlreadyExistsException;
import com.eventwave.model.Role;
import com.eventwave.model.User;
import com.eventwave.repository.RoleRepository;
import com.eventwave.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserService userService;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ========== registerUser ==========

    @Test
    void testRegisterUser_Success() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setFullName("Test User");
        request.setPassword("pass123");
        request.setRole("user");

        Role mockRole = new Role();
        mockRole.setName("USER");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(mockRole));

        ApiResponse response = userService.registerUser(request);

        assertEquals("success", response.getStatus());
        assertEquals("User registered successfully", response.getMessage());
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("Test User", savedUser.getFullName());
        assertTrue(savedUser.getPasswordHash().startsWith("$2")); // bcrypt format
    }

    @Test
    void testRegisterUser_EmailExists_ThrowsException() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> userService.registerUser(request));
    }

    @Test
    void testRegisterUser_RoleNotFound_ThrowsException() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setFullName("Test");
        request.setPassword("pass123");
        request.setRole("admin");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.registerUser(request));
        assertEquals("Role not found: ADMIN", exception.getMessage());
    }

    // ========== getUserProfile ==========

    @Test
    void testGetUserProfile_Success() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setUsername("user123");
        user.setFullName("User A");
        user.setBio("Bio");
        user.setCity("City");
        user.setState("State");
        user.setCountry("Country");
        user.setZipCode("12345");
        user.setLatitude(BigDecimal.valueOf(99.99)); // ✅ correct

        user.setLongitude(BigDecimal.valueOf(11.11));


        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        UserProfileDTO profile = userService.getUserProfile("user@example.com");

        assertEquals("user123", profile.getUsername());
        assertEquals("User A", profile.getFullName());
        assertEquals("Bio", profile.getBio());
        assertEquals("City", profile.getCity());
        assertEquals("Country", profile.getCountry());
        assertEquals(BigDecimal.valueOf(99.99), profile.getLatitude());
        assertEquals(BigDecimal.valueOf(11.11), profile.getLongitude());


    }

    @Test
    void testGetUserProfile_UserNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserProfile("missing@example.com"));
    }

    // ========== updateUserProfile ==========

    @Test
    void testUpdateUserProfile_Success() {
        User user = new User();
        user.setEmail("user@example.com");

        UserProfileUpdateRequest request = new UserProfileUpdateRequest();
        request.setBio("Updated Bio");
        request.setCity("New City");
        request.setState("New State");
        request.setCountry("New Country");
        request.setZipCode("54321");
        request.setLatitude(new java.math.BigDecimal("99.99"));
        request.setLongitude(new java.math.BigDecimal("11.11"));


        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        ApiResponse response = userService.updateUserProfile("user@example.com", request);

        assertEquals("success", response.getStatus());
        assertEquals("Profile updated successfully", response.getMessage());

        assertEquals("Updated Bio", user.getBio());
        assertEquals("New City", user.getCity());
        assertEquals("New Country", user.getCountry());
        assertEquals(new java.math.BigDecimal("99.99"), user.getLatitude());
        assertEquals(new java.math.BigDecimal("11.11"), user.getLongitude());
    }

    @Test
    void testUpdateUserProfile_UserNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        UserProfileUpdateRequest request = new UserProfileUpdateRequest();

        assertThrows(RuntimeException.class, () -> userService.updateUserProfile("missing@example.com", request));
    }
}
