package me.jumptop.novelog.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final UserRepository userRepository;

    @Transactional // 이 메서드가 시작될때 트랜잭션 시작, 끝나면 커밋함
    public void completeSurvey(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. : " + email));

        // 성공하면 completeSurvey 업데이트
        user.completeSurvey();
        userRepository.save(user);
    }
}
