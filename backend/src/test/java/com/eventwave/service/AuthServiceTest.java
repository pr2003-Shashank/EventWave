package com.eventwave.service;

import com.eventwave.dto.LoginRequest;
import com.eventwave.dto.LoginResponse;
import com.eventwave.dto.UserDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.Role;
import com.eventwave.model.User;
import com.eventwave.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        Role userRole = new Role();
        userRole.setId(1L);
        userRole.setName("USER");

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("john@example.com");
        mockUser.setPasswordHash(passwordEncoder.encode("password123"));
        mockUser.setFullName("John Doe");
        mockUser.setUsername("johnny");
        mockUser.setRoles(Set.of(userRole));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setRole("USER");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));
        when(jwtService.generateToken(mockUser.getEmail())).thenReturn("mocked-jwt-token");

        // Act
        LoginResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("success", response.getStatus());
        assertEquals("Login successful", response.getMessage());
        assertEquals("mocked-jwt-token", response.getToken());

        UserDTO userDTO = response.getUser();
        assertNotNull(userDTO);
        assertEquals("John Doe", userDTO.getFullName());
        assertEquals("johnny", userDTO.getUsername());
        assertEquals("john@example.com", userDTO.getEmail());
        assertEquals("USER", userDTO.getRole());
    }

    @Test
    void testLogin_InvalidEmail() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("invalid@example.com");
        request.setPassword("password123");
        request.setRole("USER");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // Act + Assert
        ApiException exception = assertThrows(ApiException.class, () -> {
            authService.login(request);
        });

        assertEquals("error", exception.getStatus());
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void testLogin_InvalidPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrongPassword");
        request.setRole("USER");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));

        // Act + Assert
        ApiException exception = assertThrows(ApiException.class, () -> {
            authService.login(request);
        });

        assertEquals("error", exception.getStatus());
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void testLogin_InvalidRole() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setRole("ADMIN"); // Role mismatch

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(mockUser));

        // Act + Assert
        ApiException exception = assertThrows(ApiException.class, () -> {
            authService.login(request);
        });

        assertEquals("error", exception.getStatus());
        assertEquals("Invalid credentials", exception.getMessage());
    }
}
