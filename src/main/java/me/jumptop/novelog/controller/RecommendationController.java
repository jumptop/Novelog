package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.dto.BookResponseDto;
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
    public ResponseEntity<List<BookResponseDto.BookItem>> getRecommendations(HttpSession session) {
        // 1. 세션에서 현재 사용자 정보 가져오기
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        // 2. 로그인된 사용자가 없으면 에러를 반환
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3, RecommendationService를 호출하여 추천 책 제목 받아오기
        List<BookResponseDto.BookItem> recommendations = recommendationService.getRecommendationsForUser(sessionUser.getEmail());

        // 4. 결과를 성공적으로 반환합니다.
        return ResponseEntity.ok(recommendations);
    }
}
