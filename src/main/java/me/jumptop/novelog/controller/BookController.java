package me.jumptop.novelog.controller;

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

    @GetMapping("/api/search/books")
    public BookResponseDto searchBooks(@RequestParam String query) {
        return bookApiService.searchBooks(query);
    }
}
