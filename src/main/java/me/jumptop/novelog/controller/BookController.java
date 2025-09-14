package me.jumptop.novelog.controller;

import io.swagger.v3.oas.annotations.Operation;
import me.jumptop.novelog.dto.BookResponseDto;
import me.jumptop.novelog.service.BookApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {

    private final BookApiService bookApiService;

    public BookController(BookApiService bookApiService) {
        this.bookApiService = bookApiService;
    }

    @Operation(summary = "네이버 도서 검색", description = "검색어를 기반으로 네이버 도서 API를 호출하여 책 목록을 반환")
    @GetMapping("/api/search/books")
    public BookResponseDto searchBooks(@RequestParam String query) {
        return bookApiService.searchBooks(query);
    }
}
