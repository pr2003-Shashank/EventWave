package com.eventwave.controller;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.RegistrationRequest;
import com.eventwave.dto.UserProfileDTO;
import com.eventwave.dto.UserProfileUpdateRequest;
import com.eventwave.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ApiResponse register(@Valid @RequestBody RegistrationRequest request) {
		return userService.registerUser(request);
	}

	@GetMapping("/profile")
	public UserProfileDTO getProfile(Authentication authentication) {
		String email = authentication.getName(); // Gets email from JWT token
		return userService.getUserProfile(email);
	}

	@PutMapping("/profile/update")
	public ApiResponse updateProfile(Authentication authentication, @RequestBody UserProfileUpdateRequest request) {
		String email = authentication.getName(); // Gets email from JWT token
		return userService.updateUserProfile(email, request);
	}
}
