package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.NaverBookDto;
import me.jumptop.novelog.dto.SurveyAnswerDto;
import me.jumptop.novelog.dto.SurveyRequestDto;
import me.jumptop.novelog.repository.SurveyAnswerRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.http.HttpHeaders;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final UserRepository userRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;

    @Transactional
    public User completeSurvey(String email, SurveyRequestDto requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        // 1. 장르 답변 저장
        if (requestDto.getGenres() != null && !requestDto.getGenres().isEmpty()) {
            for (String genre : requestDto.getGenres()) {
                SurveyAnswer answer = SurveyAnswer.builder()
                        .user(user)
                        .category("GENRE")
                        .content(genre)
                        .build();
                surveyAnswerRepository.save(answer);
            }
        }

        // 2. 인생 책 답변 저장 (내용이 있을 경우에만)
        if (StringUtils.hasText(requestDto.getFavoriteBook())) {
            SurveyAnswer answer = SurveyAnswer.builder()
                    .user(user)
                    .category("FAVORITE_BOOK")
                    .content(requestDto.getFavoriteBook())
                    .build();
            surveyAnswerRepository.save(answer);
        }

        // 3. 사용자의 설문 완료 상태를 true로 변경
        user.completeSurvey();
        userRepository.save(user);

        return user;
    }

    @Transactional(readOnly = true)
    public List<SurveyAnswerDto> getAnswersByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        return surveyAnswerRepository.findByUser(user).stream()
                .map(SurveyAnswerDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void resetSurveyStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        surveyAnswerRepository.deleteAllByUser(user);

        user.resetSurvey();
        userRepository.save(user);
    }
}
