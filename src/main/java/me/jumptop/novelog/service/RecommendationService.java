package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.NaverBookDto;
import me.jumptop.novelog.repository.SurveyAnswerRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final GeminiService geminiService;
    private final NaverBookApiService naverBookApiService;

    public List<NaverBookDto.Item> getRecommendationsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        List<SurveyAnswer> answers = surveyAnswerRepository.findByUser(user);
        if (answers.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<String>> answersByCategory = answers.stream()
                .collect(Collectors.groupingBy(SurveyAnswer::getCategory,
                        Collectors.mapping(SurveyAnswer::getContent, Collectors.toList())));

        String preferredGenres = String.join(", ", answersByCategory.getOrDefault("GENRE", Collections.emptyList()));
        String favoriteBook = answersByCategory.getOrDefault("FAVORITE_BOOK", Collections.emptyList()).stream().findFirst().orElse("없음");

        String prompt = String.format(
            "사용자가 선호하는 소설 장르는 [%s] 이고, 최근 감명 깊게 읽은 책은 '%s' 입니다. " +
            "이 정보를 바탕으로 사용자가 좋아할 만한 '한국 소설' 10권의 제목을 추천해주세요. " +
            "매우 중요: 반드시 일반 문학 소설이어야 하며, '라이트 노벨(Light Novel)', '웹소설', '만화(Comics)'는 반드시 제외해주세요. " +
            "책 제목은 '한글'로, 쉼표(,)로만 구분해서 알려주세요.",
            preferredGenres, favoriteBook
        );

        String geminiResponse = geminiService.generateContent(prompt);
        List<String> recommendedTitles = List.of(geminiResponse.split(","));

        List<NaverBookDto.Item> finalRecommendations = new ArrayList<>();

        // [수정된 로직] Google API 검증을 제거하고, Naver API 검색 결과가 있으면 모두 추가합니다.
        for (String title : recommendedTitles) {
            try {
                NaverBookDto naverResult = naverBookApiService.searchBooks(title.trim());
                if (naverResult != null && naverResult.getItems() != null && !naverResult.getItems().isEmpty()) {
                    finalRecommendations.add(naverResult.getItems().get(0));
                }
            } catch (Exception e) {
                System.err.println("Error processing recommendation for title: " + title + " - " + e.getMessage());
            }
        }

        return finalRecommendations;
    }
}