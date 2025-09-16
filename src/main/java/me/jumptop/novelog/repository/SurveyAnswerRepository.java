package me.jumptop.novelog.repository;

import jakarta.transaction.Transactional;
import me.jumptop.novelog.domain.SurveyAnswer;
import me.jumptop.novelog.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    // User 객체로 모든 SurveyAnswer를 찾는 메서드 추가
    List<SurveyAnswer> findByUser(User user);

    @Transactional
    void deleteAllByUser(User user);
}
