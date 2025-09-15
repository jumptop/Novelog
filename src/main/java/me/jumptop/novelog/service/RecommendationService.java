package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.BookResponseDto;
import me.jumptop.novelog.repository.SurveyAnswerRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final GeminiService geminiService;
    private final BookApiService bookApiService; // BookApiService 주입 추가

    // 반환 타입을 List<String>에서 List<BookResponseDto.BookItem>으로 변경
    public List<BookResponseDto.BookItem> getRecommendationsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        List<SurveyAnswer> answers = surveyAnswerRepository.findByUser(user);
        if (answers.isEmpty()) {
            return Collections.emptyList(); // 설문 답변이 없으면 빈 리스트 반환
        }
        
        String preferredGenres = answers.stream()
                .map(SurveyAnswer::getContent)
                .collect(Collectors.joining(", "));

        String prompt = String.format(
            "A user likes the following book genres: [%s]. " +
            "Based on these preferences, recommend 5 novel titles. " +
            "Please provide only the titles, separated by commas. " +
            "For example: Title 1,Title 2,Title 3,Title 4,Title 5",
            preferredGenres
        );

        String geminiResponse = geminiService.generateContent(prompt);
        List<String> recommendedTitles = List.of(geminiResponse.split(","));

        // [추가된 핵심 로직]
        // 각 제목으로 네이버 API를 검색하여 상세 정보를 가져옵니다.
        return recommendedTitles.stream()
                .map(title -> {
                    try {
                        BookResponseDto searchResult = bookApiService.searchBooks(title.trim());
                        if (searchResult != null && !searchResult.getItems().isEmpty()) {
                            return searchResult.getItems().get(0);
                        }
                    } catch (Exception e) {
                        System.err.println("Error searching for book: " + title + " - " + e.getMessage());
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}