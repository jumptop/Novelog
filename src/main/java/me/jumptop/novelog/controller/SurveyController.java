package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.dto.SessionUser;
import me.jumptop.novelog.service.SurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    @PostMapping("/api/survey/complete")
    public ResponseEntity<String> completeSurvey(HttpSession session) {
        // 세션에서 현재 로그인된 사용자 정보 불러오기
        SessionUser sessionUser = (SessionUser) session.getAttribute("user");

        // 로그인된 사용자가 없다면, 401 Unauthorized 에러 응답
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 서비스 레이어에 설문 완료 처리를 위임 (사용자 이메일을 넘겨줌)
        surveyService.completeSurvey(sessionUser.getEmail());

        // 성공적으로 처리되었음을 알리는 200 OK 응답
        return ResponseEntity.ok("설문이 성공적으로 종료되었습니다.");
    }

}
