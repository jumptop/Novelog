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
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookResponseDto {
    private List<BookItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BookItem {
        private String id;
        private VolumeInfo volumeInfo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        @JsonProperty("title")
        private String title;

        @JsonProperty("authors")
        private List<String> authors;

        @JsonProperty("publisher")
        private String publisher;

        @JsonProperty("publishedDate")
        private String publishedDate;

        @JsonProperty("description")
        private String description;

        @JsonProperty("categories")
        private List<String> categories;

        @JsonProperty("imageLinks")
        private ImageLinks imageLinks;

        @JsonProperty("industryIdentifiers")
        private List<IndustryIdentifier> industryIdentifiers;

        // [추가된 필드] Google Books 정보 페이지 링크
        @JsonProperty("infoLink")
        private String infoLink;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        @JsonProperty("thumbnail")
        private String thumbnail;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IndustryIdentifier {
        private String type;
        private String identifier;
    }
}