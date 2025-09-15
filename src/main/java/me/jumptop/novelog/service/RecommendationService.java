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
    private final BookApiService bookApiService; // BookApiService를 주입받도록 추가

    public List<BookResponseDto.BookItem> getRecommendationsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        List<SurveyAnswer> answers = surveyAnswerRepository.findByUser(user);
        if (answers.isEmpty()) {
            return Collections.emptyList();
        }
        
        String preferredGenres = answers.stream()
                .map(SurveyAnswer::getContent)
                .collect(Collectors.joining(", "));

        String prompt = String.format(
            "A user likes the following book genres: [%s]. " +
            "Based on these preferences, recommend 3 Korean novel titles. " +
            "Please provide only the titles, separated by commas, without any other introductory text or numbering. " +
            "For example: Title 1,Title 2,Title 3",
            preferredGenres
        );

        String geminiResponse = geminiService.generateContent(prompt);
        List<String> recommendedTitles = List.of(geminiResponse.split(","));

        // 각 제목으로 Google Books API를 검색하여 상세 정보를 가져옵니다.
        return recommendedTitles.stream()
                .map(title -> {
                    try {
                        BookResponseDto searchResult = bookApiService.searchBooks(title.trim());
                        if (searchResult != null && searchResult.getItems() != null && !searchResult.getItems().isEmpty()) {
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