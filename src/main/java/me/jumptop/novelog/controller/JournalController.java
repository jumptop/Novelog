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

    @GetMapping("/{id}")
    public ResponseEntity<JournalResponseDto> getJournalById(@PathVariable Long id, HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            JournalResponseDto journal = journalService.getJournalEntryById(id, user.getEmail());
            return ResponseEntity.ok(journal);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // 권한 없음 또는 기록 없음
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id, HttpSession session) {
        SessionUser user = (SessionUser) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            journalService.deleteJournalEntry(id, user.getEmail());
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음 또는 기록 없음
        }
    }
}
