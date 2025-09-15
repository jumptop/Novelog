package me.jumptop.novelog.service;

import me.jumptop.novelog.dto.GoogleBookDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GoogleBookApiService {

    private final WebClient webClient;

    @Value("${google.books.api.url}")
    private String apiUrl;

    @Value("${google.books.api.key}")
    private String apiKey;

    // 생성자 이름을 클래스 이름과 일치시킵니다.
    public GoogleBookApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // 반환 타입을 GoogleBookDto로 변경합니다.
    public GoogleBookDto searchBooks(String query) {
        return webClient.get()
                .uri(apiUrl, uriBuilder -> uriBuilder
                        .queryParam("q", query)
                        .queryParam("key", apiKey)
                        .queryParam("maxResults", 20)
                        .build())
                .retrieve()
                .bodyToMono(GoogleBookDto.class) // DTO 클래스를 GoogleBookDto로 변경
                .block();
    }

    /**
     * Google Books API의 볼륨 ID로 책 한 권의 정보를 가져옵니다.
     * @param id 책의 고유 볼륨 ID
     * @return 책 한 권의 상세 정보
     */
    // 반환 타입을 GoogleBookDto.BookItem으로 변경합니다.
    public GoogleBookDto.BookItem getBookById(String id) {
        String detailApiUrl = apiUrl + "/" + id;
        return webClient.get()
                .uri(detailApiUrl, uriBuilder -> uriBuilder
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(GoogleBookDto.BookItem.class) // DTO 클래스를 GoogleBookDto.BookItem으로 변경
                .block();
    }
}