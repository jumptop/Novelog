package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.dto.SessionUser;
import me.jumptop.novelog.dto.SurveyAnswerDto;
import me.jumptop.novelog.service.SurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final SurveyService surveyService;

    @GetMapping("/api/user/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        
        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/api/user/answers")
    public ResponseEntity<List<SurveyAnswerDto>> getSurveyAnswers(HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<SurveyAnswerDto> answers = surveyService.getAnswersByUser(user.getEmail());
        return ResponseEntity.ok(answers);
    }

    @PostMapping("/api/user/me/reset-survey")
    public ResponseEntity<String> resetSurvey(HttpSession session) {
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        surveyService.resetSurveyStatus(sessionUser.getEmail());
        return ResponseEntity.ok("현재 사용자의 설문 상태가 초기화되었습니다.");
    }
}
