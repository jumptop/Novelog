package me.jumptop.novelog;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

// @TestPropertySource 어노테이션을 추가합니다.
@TestPropertySource(properties = {
    "gemini.api.key=dummy_key",
    "google.books.api.key=dummy_key",
    "spring.security.oauth2.client.registration.google.client-id=dummy_id",
    "spring.security.oauth2.client.registration.google.client-secret=dummy_secret"
})
@SpringBootTest
class NovelogApplicationTests {

    @Test
    void contextLoads() {
    }

}