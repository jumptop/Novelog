package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.SurveyRequestDto;
import me.jumptop.novelog.repository.SurveyAnswerRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    /**
     * 반환 타입을 void에서 User로 변경합니다.
     * @return 업데이트된 User 엔티티
     */
    @Transactional
    public User completeSurvey(String email, SurveyRequestDto requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        List<String> genres = requestDto.getGenres();
        for (String genre : genres) {
            SurveyAnswer answer = SurveyAnswer.builder()
                    .user(user)
                    .category("GENRE")
                    .content(genre)
                    .build();
            surveyAnswerRepository.save(answer);
        }

        user.completeSurvey();
        userRepository.save(user);

        // 최신 상태의 user 객체를 반환합니다.
        return user;
    }

    @Transactional
    public void resetSurveyStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        user.resetSurvey();
        userRepository.save(user);
    }
}