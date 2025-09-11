package me.jumptop.novelog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BookResponseDto {
    private String lastBuildDate;
    private int total;
    private int start;
    private int display;
    private List<BookItem> items;

    @Getter
    @NoArgsConstructor
    public static class BookItem {
        private String title;
        private String link;
        private String image;
        private String author;
        private String discount;
        private String publisher;
        private String pubdate;
        private String isbn;
        private String description;
    }
}
