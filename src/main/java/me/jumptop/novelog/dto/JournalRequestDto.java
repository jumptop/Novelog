package me.jumptop.novelog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JournalRequestDto {
    private String bookTitle;
    private String bookIsbn;
    private String bookImage;
    private String userNotes;
}
