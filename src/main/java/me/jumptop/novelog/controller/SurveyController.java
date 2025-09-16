package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.SessionUser;
import me.jumptop.novelog.dto.SurveyRequestDto;
import me.jumptop.novelog.service.SurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    @PostMapping("/api/survey/complete")
    public ResponseEntity<String> completeSurvey(@RequestBody SurveyRequestDto requestDto, HttpSession session) {
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 1. 서비스로부터 업데이트된 User 객체를 받습니다.
        User updatedUser = surveyService.completeSurvey(sessionUser.getEmail(), requestDto);

        // 2. 최신 User 정보로 새로운 SessionUser 객체를 만듭니다.
        SessionUser newSessionUser = new SessionUser(updatedUser);

        // 3. 세션의 "user" 속성을 새로운 SessionUser 객체로 덮어씌웁니다.
        session.setAttribute("user", newSessionUser);

        return ResponseEntity.ok("설문이 정상적으로 완료되었습니다.");
    }

    @DeleteMapping("/api/survey/reset")
    public ResponseEntity<String> resetSurvey(HttpSession session) {
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        surveyService.resetSurveyStatus(sessionUser.getEmail());

        return ResponseEntity.ok("설문 내역이 초기화되었습니다.");
    }
}