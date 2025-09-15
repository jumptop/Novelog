package me.jumptop.novelog.service;

import me.jumptop.novelog.dto.GeminiApiDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        // gemini api는 BaseURL을 사용하지 않으므로, 새로 Builder를 주입받아 생성
        this.webClient = webClientBuilder.build();
    }

    public String generateContent(String prompt) {
        // 1. 요청 DTO 생성
        GeminiApiDto.Request requestDto = new GeminiApiDto.Request(
                List.of(new GeminiApiDto.Content(List.of(new GeminiApiDto.Part(prompt))))
        );

        URI uri = UriComponentsBuilder
                .fromUriString(apiUrl)
                .queryParam("key", apiKey)
                .build()
                .toUri();

        // 2. WebClient로 API 호출
        GeminiApiDto.Response response = webClient.post()
                .uri(uri)
                .header("Content-Type", "application/json")
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(GeminiApiDto.Response.class)
                .block(); // 동기로 기다리기

        // 3. 응답에서 텍스트 추출하여 반환
        if (response != null && !response.getCandidates().isEmpty()) {
            try {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            } catch (Exception e) {
                System.err.println("Gemini 응답에서 텍스트를 추출하는데 실패하였습니다: " + e.getMessage());
                return "추천 결과 파싱에 실패했습니다.";
            }
        }

        return "추천 결과를 생성하지 못했습니다.";
    }
}
