package me.jumptop.novelog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookResponseDto {
    // Google Books API는 책 목록을 'items' 키로 반환합니다.
    private List<BookItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BookItem {
        // 책의 고유 ID
        private String id;
        // 실제 책 정보가 담긴 객체
        private VolumeInfo volumeInfo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        private String title;
        // 저자는 여러 명일 수 있어 배열로 제공됩니다.
        private List<String> authors;
        private String publisher;
        private String publishedDate;
        private String description;
        // 장르 정보
        private List<String> categories;
        // 이미지 링크가 담긴 객체
        private ImageLinks imageLinks;
        // ISBN 정보를 담는 객체 리스트
        private List<IndustryIdentifier> industryIdentifiers;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        // 다양한 크기의 이미지 중 썸네일을 사용합니다.
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
