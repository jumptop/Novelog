package me.jumptop.novelog.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.SurveyRequestDto;
import me.jumptop.novelog.repository.SurveyAnswerRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    @Transactional // 이 메서드가 시작될때 트랜잭션 시작, 끝나면 커밋함
    public void completeSurvey(String email, SurveyRequestDto requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. : " + email));

        List<String> genres = requestDto.getGenres();
        for (String genre : genres) {
            SurveyAnswer answer = SurveyAnswer.builder()
                    .user(user)
                    .category("GENRE") // 질문 카테고리를 "GENRE"로 지정
                    .content(genre) // 답변 내용을 실제 장르 이름으로 저장
                    .build();
            surveyAnswerRepository.save(answer);
        }

        // 성공하면 completeSurvey 업데이트
        user.completeSurvey();
        userRepository.save(user);
    }
}
