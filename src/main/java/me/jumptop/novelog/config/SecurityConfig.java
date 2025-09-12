package me.jumptop.novelog.config;

import jakarta.servlet.http.HttpServletResponse;
import me.jumptop.novelog.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity // 스프링 시큐리티 활성화
public class SecurityConfig {

    // 우리가 만든 CustomOAuth2UserService 주입
    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 아래 명시한 주소는 로그인 여부와 상관없이 모두 접근 허용
                        .requestMatchers(
                                "/",
                                "/login",
                                "/main",
                                "/api/search/books",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        )
                        .permitAll()
                        // 위에서 명시한 주소를 제외한 나머지 주소는 반드시 로그인(인증)된 사용자만 사용 가능
                        .anyRequest().authenticated()
                )
                // 로그아웃 기능 설정
                .logout(logout -> logout
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                )
                // OAuth2를 이용한 소설 로그인 기능 설정
                .oauth2Login(oauth2 -> oauth2
                        // OAuth2 로그인 성공 이후 사용자 정보를 가져올 때의 설정을 담당
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .defaultSuccessUrl("http://localhost:8000/main", true)
                        .failureUrl("http://localhost:8000/login?error=true")
                );
        return http.build();
    }

    // CORS 설정을 위한 Bean을 정의
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
