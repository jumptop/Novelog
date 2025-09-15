package me.jumptop.novelog.service;

import me.jumptop.novelog.dto.BookResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BookApiService {

    private final WebClient webClient;

    @Value("${google.books.api.url}")
    private String apiUrl;

    @Value("${google.books.api.key}")
    private String apiKey;

    public BookApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public BookResponseDto searchBooks(String query) {
        return webClient.get()
                .uri(apiUrl, uriBuilder -> uriBuilder
                        .queryParam("q", query)
                        .queryParam("key", apiKey)
                        .queryParam("maxResults", 20)
                        .build())
                .retrieve()
                .bodyToMono(BookResponseDto.class)
                .block();
    }

    /**
     * Google Books API의 볼륨 ID로 책 한 권의 정보를 가져옵니다.
     * @param id 책의 고유 볼륨 ID
     * @return 책 한 권의 상세 정보
     */
    public BookResponseDto.BookItem getBookById(String id) {
        String detailApiUrl = apiUrl + "/" + id;
        // uri 생성 방식을 안정적인 방식으로 수정
        return webClient.get()
                .uri(detailApiUrl, uriBuilder -> uriBuilder
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(BookResponseDto.BookItem.class)
                .block();
    }
}
