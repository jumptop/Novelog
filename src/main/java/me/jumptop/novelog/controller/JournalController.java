package me.jumptop.novelog.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.dto.JournalRequestDto;
import me.jumptop.novelog.dto.JournalResponseDto;
import me.jumptop.novelog.dto.SessionUser;
import me.jumptop.novelog.service.JournalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/journals")
public class JournalController {

    private final JournalService journalService;

    @PostMapping
    public ResponseEntity<JournalResponseDto> createJournal(@RequestBody JournalRequestDto requestDto, HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        JournalResponseDto responseDto = journalService.createJournal(user.getEmail(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<JournalResponseDto>> getJournals(HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<JournalResponseDto> journals = journalService.getJournalsForUser(user.getEmail());
        return ResponseEntity.ok(journals);
    }
}
