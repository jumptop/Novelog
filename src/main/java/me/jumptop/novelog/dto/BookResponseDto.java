package me.jumptop.novelog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BookResponseDto {
    private String lastBuildDate;
    private int total;
    private int start;
    private int display;
    private List<BookItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BookItem {

        @JsonProperty("title")
        private String title;

        @JsonProperty("link")
        private String link;

        @JsonProperty("image")
        private String image;

        @JsonProperty("author")
        private String author;

        @JsonProperty("discount")
        private String discount;

        @JsonProperty("publisher")
        private String publisher;

        @JsonProperty("pubdate")
        private String pubdate;

        @JsonProperty("isbn")
        private String isbn;

        @JsonProperty("description")
        private String description;
    }
}