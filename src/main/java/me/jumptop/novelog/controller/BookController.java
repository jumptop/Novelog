package me.jumptop.novelog.controller;

import me.jumptop.novelog.dto.NaverBookDto;
import me.jumptop.novelog.service.NaverBookApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {

    private final NaverBookApiService naverBookApiService;

    public BookController(NaverBookApiService naverBookApiService) {
        this.naverBookApiService = naverBookApiService;
    }

    @GetMapping("/api/search/books")
    public NaverBookDto searchBooks(@RequestParam String query) {
        return naverBookApiService.searchBooks(query);
    }

    @GetMapping("/api/books/{isbn}")
    public ResponseEntity<NaverBookDto.Item> getBookByIsbn(@PathVariable String isbn) {
        NaverBookDto searchResult = naverBookApiService.searchBooks(isbn);
        if (searchResult != null && !searchResult.getItems().isEmpty()) {
            return ResponseEntity.ok(searchResult.getItems().get(0));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/books/new-releases")
    public NaverBookDto getNewReleases() {
        return naverBookApiService.getNewReleases();
    }
}
