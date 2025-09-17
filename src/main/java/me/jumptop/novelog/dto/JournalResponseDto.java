package me.jumptop.novelog.dto;

import lombok.Getter;
import me.jumptop.novelog.domain.Journal;

import java.time.LocalDateTime;

@Getter
public class JournalResponseDto {
    private Long id;
    private String bookTitle;
    private String bookImage;
    private String userNotes;
    private String aiJournal;
    private LocalDateTime createdAt;

    public JournalResponseDto(Journal entity) {
        this.id = entity.getId();
        this.bookTitle = entity.getBookTitle();
        this.bookImage = entity.getBookImage();
        this.userNotes = entity.getUserNotes();
        this.aiJournal = entity.getAiJournal();
        this.createdAt = entity.getCreatedAt();
    }
}
