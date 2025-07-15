package com.eventwave.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventwave.dto.ApiResponse;
import com.eventwave.dto.EventSummaryDTO;
import com.eventwave.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/add/{eventId}")
    public ApiResponse markFavorite(@PathVariable Long eventId, Authentication authentication) {
        String email = authentication.getName();
        return favoriteService.markFavorite(email, eventId);
    }

    @DeleteMapping("/remove/{eventId}")
    public ApiResponse unmarkFavorite(@PathVariable Long eventId, Authentication authentication) {
        String email = authentication.getName();
        return favoriteService.unmarkFavorite(email, eventId);
    }

    @GetMapping
    public List<EventSummaryDTO> getUserFavorites(Authentication authentication) {
        String email = authentication.getName();
        return favoriteService.getUserFavorites(email);
    }
}
