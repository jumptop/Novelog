package me.jumptop.novelog.repository;

import me.jumptop.novelog.domain.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
}
