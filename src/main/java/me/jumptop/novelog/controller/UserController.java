package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import me.jumptop.novelog.dto.SessionUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/user/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        
        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        
        return ResponseEntity.ok(user);
    }
}
