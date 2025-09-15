package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.BookResponseDto;
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
    private final BookApiService bookApiService;

    public List<BookResponseDto.BookItem> getRecommendationsForUser(String email) {
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

        // 프롬프트에 제외할 장르를 명시적으로 추가
        String prompt = String.format(
            "사용자가 선호하는 소설 장르는 [%s] 이고, 최근 감명 깊게 읽은 책은 '%s' 입니다. " +
            "이 정보를 바탕으로 사용자가 좋아할 만한 '일반 문학 소설' 10권의 제목을 추천해주세요. " +
            "매우 중요: 반드시 일반 문학 소설이어야 하며, '라이트 노벨(Light Novel)', '웹소설', '만화(Comics)'는 반드시 제외해주세요. 또한 페미니스트나 정치적인 내용을 담은 소설은 제외해주세요 " +
            "책 제목은 '한글'로, 쉼표(,)로만 구분해서 알려주세요.",
            preferredGenres, favoriteBook
        );

        String geminiResponse = geminiService.generateContent(prompt);
        List<String> recommendedTitles = List.of(geminiResponse.split(","));

        List<BookResponseDto.BookItem> validatedRecommendations = new ArrayList<>();

        for (String title : recommendedTitles) {
            if (validatedRecommendations.size() >= 3) {
                break;
            }

            try {
                BookResponseDto searchResult = bookApiService.searchBooks(title.trim());
                if (searchResult != null && searchResult.getItems() != null && !searchResult.getItems().isEmpty()) {
                    
                    BookResponseDto.BookItem bookItem = searchResult.getItems().get(0);
                    
                    // 검증 로직 강화
                    boolean isFiction = false;
                    boolean isExcluded = false; // 제외할 장르인지 확인하는 플래그
                    if (bookItem.getVolumeInfo() != null && bookItem.getVolumeInfo().getCategories() != null) {
                        List<String> categories = bookItem.getVolumeInfo().getCategories();
                        
                        isFiction = categories.stream().anyMatch(c -> c.contains("Fiction"));
                        isExcluded = categories.stream().anyMatch(c -> c.contains("Light Novel") || c.contains("Comics"));
                    }
                    
                    // 소설이면서(isFiction=true), 제외할 장르가 아닐 때(isExcluded=false)만 최종 목록에 추가
                    if (isFiction && !isExcluded) {
                        validatedRecommendations.add(bookItem);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error searching for book: " + title + " - " + e.getMessage());
            }
        }
        
        return validatedRecommendations;
    }
}