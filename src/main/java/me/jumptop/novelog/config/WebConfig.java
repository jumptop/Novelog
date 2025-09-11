package me.jumptop.novelog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // /api/로 시작하는 모든 경로에 대해
                .allowedOrigins("http://localhost:5173/") // React 개발 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 이러한 메서드를 사용하도록
                .allowCredentials(true); // 허용한다
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://openapi.naver.com")
                .build();
    }
}
