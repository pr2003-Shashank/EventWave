package com.eventwave.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.EventSummaryDTO;
import com.eventwave.exception.ApiException;
import com.eventwave.model.Event;
import com.eventwave.model.Favorite;
import com.eventwave.model.User;
import com.eventwave.repository.EventRepository;
import com.eventwave.repository.FavoriteRepository;
import com.eventwave.repository.RegistrationRepository;
import com.eventwave.repository.UserRepository;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    public ApiResponse markFavorite(String email, Long eventId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("error", "User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("error", "Event not found"));

        boolean alreadyExists = favoriteRepository.existsByUserIdAndEventId(user.getId(), eventId);
        if (alreadyExists) {
            return new ApiResponse("info", "Already marked as favorite");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setEvent(event);
        favoriteRepository.save(favorite);

        return new ApiResponse("success", "Event marked as favorite");
    }

    public ApiResponse unmarkFavorite(String email, Long eventId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("error", "User not found"));

        Favorite favorite = favoriteRepository.findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() -> new ApiException("error", "Favorite not found"));

        favoriteRepository.delete(favorite);
        return new ApiResponse("success", "Favorite removed successfully");
    }

    public List<EventSummaryDTO> getUserFavorites(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("error", "User not found"));

        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());

        return favorites.stream().map(fav -> {
            Event event = fav.getEvent();
            EventSummaryDTO dto = new EventSummaryDTO();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setDate(event.getDate());
            dto.setLocation(event.getLocation());
            dto.setImageUrl(event.getImageUrl());
            
            int registeredCount = registrationRepository.countByEventId(event.getId());   
	        dto.setAvailableSeats(event.getCapacity() - registeredCount);
	        
	        dto.setRegistered(registrationRepository.existsByUserIdAndEventId(user.getId(), event.getId()));

            dto.setFavorite(true);
            return dto;
        }).collect(Collectors.toList());
    }
}
