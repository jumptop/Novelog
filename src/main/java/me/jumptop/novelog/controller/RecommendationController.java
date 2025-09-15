package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.dto.NaverBookDto;
import me.jumptop.novelog.dto.SessionUser;
import me.jumptop.novelog.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/api/recommendations")
    public ResponseEntity<List<NaverBookDto.Item>> getRecommendations(HttpSession session) {
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<NaverBookDto.Item> recommendations = recommendationService.getRecommendationsForUser(sessionUser.getEmail());

        return ResponseEntity.ok(recommendations);
    }
}