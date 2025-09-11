package me.jumptop.novelog.service;// 네이버 검색 API 예제 - 블로그 검색


import me.jumptop.novelog.dto.BookResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class BookApiService {

    private final WebClient webClient;

    @Value("${naver.api.client-id}")
    private String clientId;

    @Value("${naver.api.client-secret}")
    private String clientSecret;

    public BookApiService(WebClient webClient) {
        this.webClient = webClient;
    }

    public BookResponseDto searchBooks(String query) {
        String apiURL = "/v1/search/book.json";

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(apiURL)
                        .queryParam("query", query)
                        .queryParam("display", 10)
                        .build())
                .header("X-Naver-Client-Id", clientId)
                .header("X-Naver-Client-Secret", clientSecret)
                .retrieve()
                .bodyToMono(BookResponseDto.class)
                .block();
    }
}