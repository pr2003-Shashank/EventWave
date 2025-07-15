package com.eventwave.service;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.RegistrationRequest;
import com.eventwave.dto.UserProfileDTO;
import com.eventwave.dto.UserProfileUpdateRequest;
import com.eventwave.model.Role;
import com.eventwave.model.User;
import com.eventwave.repository.RoleRepository;
import com.eventwave.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.eventwave.exception.ApiException;
import com.eventwave.exception.EmailAlreadyExistsException;

import java.util.Set;

@Service
public class UserService {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private OtpService otpService;

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public ApiResponse registerUser(RegistrationRequest request) {

	    if (userRepository.existsByEmail(request.getEmail())) {
	        throw new EmailAlreadyExistsException("Email already registered.");
	    }

	    if (!otpService.isEmailVerified(request.getEmail())) {
	        throw new ApiException("email_not_verified", "Please verify your email before registering.");
	    }

	    // Generate unique username
	    String emailPrefix = request.getEmail().split("@")[0];
	    String generatedUsername = emailPrefix + "_" + System.currentTimeMillis();

	    User user = new User();
	    user.setUsername(generatedUsername);
	    user.setEmail(request.getEmail());
	    user.setFullName(request.getFullName());
	    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

	    // Assign role
	    String roleName = request.getRole().toUpperCase();
	    Role role = roleRepository.findByName(roleName)
	            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
	    user.setRoles(Set.of(role));

	    userRepository.save(user);

	    // Clean up verified email after successful registration
	    otpService.removeVerifiedEmail(request.getEmail());

	    return new ApiResponse("success", "User registered successfully");
	}


	public UserProfileDTO getUserProfile(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		UserProfileDTO userProfileDTO = new UserProfileDTO();
		userProfileDTO.setFullName(user.getFullName());
		userProfileDTO.setEmail(user.getEmail());
		userProfileDTO.setUsername(user.getUsername());
		userProfileDTO.setBio(user.getBio());
		userProfileDTO.setCity(user.getCity());
		userProfileDTO.setState(user.getState());
		userProfileDTO.setCountry(user.getCountry());
		userProfileDTO.setZipCode(user.getZipCode());
		userProfileDTO.setLatitude(user.getLatitude());
		userProfileDTO.setLongitude(user.getLongitude());

		return userProfileDTO;
	}

	public ApiResponse updateUserProfile(String email, UserProfileUpdateRequest request) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		user.setBio(request.getBio());
		user.setCity(request.getCity());
		user.setState(request.getState());
		user.setCountry(request.getCountry());
		user.setZipCode(request.getZipCode());

		if (request.getLatitude() != null)
			user.setLatitude(request.getLatitude());
		if (request.getLongitude() != null)
			user.setLongitude(request.getLongitude());

		userRepository.save(user);
		return new ApiResponse("success", "Profile updated successfully");
	}

}
