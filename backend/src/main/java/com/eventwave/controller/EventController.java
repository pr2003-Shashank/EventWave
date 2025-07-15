package com.eventwave.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.EventCreateRequest;
import com.eventwave.dto.EventDetailDTO;
import com.eventwave.dto.EventFilterDTO;
import com.eventwave.dto.EventSummaryDTO;
import com.eventwave.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {
	
	@Autowired
	private EventService eventService;
	
	@PostMapping("/create")
	public ApiResponse createEvent(
			Authentication authentication,
	        @RequestParam String title,
	        @RequestParam String description,
	        @RequestParam String location,
	        @RequestParam BigDecimal latitude,
	        @RequestParam BigDecimal longitude,
	        @RequestParam Double price,
	        @RequestParam Integer capacity,
	        @RequestParam Long categoryId,
	        @RequestParam String date, // e.g., 2025-07-01
	        @RequestParam String startTime, // e.g., 15:30
	        @RequestParam String endTime,   // e.g., 17:30
	        @RequestPart(required = false) MultipartFile image
			) {
		EventCreateRequest request = new EventCreateRequest();
		request.setTitle(title);
	    request.setDescription(description);
	    request.setLocation(location);
	    request.setLatitude(latitude);
	    request.setLongitude(longitude);
	    request.setCapacity(capacity);
	    request.setPrice(price);
	    request.setCategoryId(categoryId);
	    request.setImage(image);

	    // Parse date and time
	    request.setDate(LocalDate.parse(date)); // ISO-8601 format
	    request.setStartTime(LocalTime.parse(startTime));
	    request.setEndTime(LocalTime.parse(endTime));
		
	    String email = authentication.getName();
	    return eventService.createEvent(email, request);
	}
	
	@GetMapping
	public List<EventSummaryDTO> listEvents(Authentication authentication) {
	    String email = (authentication != null) ? authentication.getName() : null;
	    return eventService.getAllEvents(email);
	}
	@GetMapping("/my-events")
	public List<EventSummaryDTO> getMyEvents(Authentication authentication) {
	    String email = authentication.getName();
	    return eventService.getMyEvents(email);
	}

	@GetMapping("/{id}")
	public EventDetailDTO getEventDetails(@PathVariable Long id, Authentication authentication) {
	    String email = (authentication != null) ? authentication.getName() : null;
	    return eventService.getEventById(id, email);
	}
	
	@PostMapping("/filter")
	public List<EventSummaryDTO> filterEvents(@RequestBody EventFilterDTO filter, Authentication authentication) {
	    String email = (authentication != null) ? authentication.getName() : null;
	    return eventService.filterEvents(filter,email);
	}
	
	@PutMapping("/edit/{id}")
	public ApiResponse updateEvent(
	        @PathVariable("id") Long eventId,
	        Authentication authentication,
	        @RequestParam String title,
	        @RequestParam String description,
	        @RequestParam String location,
	        @RequestParam Double price,
	        @RequestParam Integer capacity,
	        @RequestParam Long categoryId,
	        @RequestParam String date,
	        @RequestParam String startTime,
	        @RequestParam String endTime,
	        @RequestParam(required = false) BigDecimal latitude,
	        @RequestParam(required = false) BigDecimal longitude,
	        @RequestPart(required = false) MultipartFile image
	) {
	    EventCreateRequest request = new EventCreateRequest();
	    request.setTitle(title);
	    request.setDescription(description);
	    request.setLocation(location);
	    request.setPrice(price);
	    request.setCapacity(capacity);
	    request.setCategoryId(categoryId);
	    request.setDate(LocalDate.parse(date));
	    request.setStartTime(LocalTime.parse(startTime));
	    request.setEndTime(LocalTime.parse(endTime));
	    request.setLatitude(latitude);
	    request.setLongitude(longitude);
	    request.setImage(image);

	    String email = authentication.getName();
	    return eventService.updateEvent(eventId, email, request);
	}

	@DeleteMapping("/delete/{id}")
	public ApiResponse deleteEvent(@PathVariable("id") Long eventId, Authentication authentication) {
	    String email = authentication.getName();
	    return eventService.deleteEvent(eventId, email);
	}

}
