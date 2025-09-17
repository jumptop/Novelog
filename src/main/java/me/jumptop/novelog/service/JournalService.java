package me.jumptop.novelog.service;

import lombok.RequiredArgsConstructor;
import me.jumptop.novelog.domain.Journal;
import me.jumptop.novelog.domain.User;
import me.jumptop.novelog.dto.JournalRequestDto;
import me.jumptop.novelog.dto.JournalResponseDto;
import me.jumptop.novelog.repository.JournalRepository;
import me.jumptop.novelog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Transactional
    public JournalResponseDto createJournal(String email, JournalRequestDto requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        String prompt = String.format(
                "다음 책에 대한 사용자의 감상평을 바탕으로, 500자 내외의 풍부한 독서 기록을 작성해줘. " +
                "책 제목: %s. 사용자 감상평: %s.",
                requestDto.getBookTitle(), requestDto.getUserNotes()
        );

        String aiResponse = geminiService.generateContent(prompt);

        Journal journal = Journal.builder()
                .user(user)
                .bookTitle(requestDto.getBookTitle())
                .bookIsbn(requestDto.getBookIsbn())
                .bookImage(requestDto.getBookImage())
                .userNotes(requestDto.getUserNotes())
                .aiJournal(aiResponse)
                .build();

        Journal savedJournal = journalRepository.save(journal);

        return new JournalResponseDto(savedJournal);
    }

    @Transactional(readOnly = true)
    public List<JournalResponseDto> getJournalsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. email=" + email));

        return journalRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(JournalResponseDto::new)
                .collect(Collectors.toList());
    }
}
