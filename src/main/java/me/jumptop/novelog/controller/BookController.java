package me.jumptop.novelog.controller;

import me.jumptop.novelog.dto.BookResponseDto;
import me.jumptop.novelog.service.BookApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    /**
     * ISBN 대신 Google Books 볼륨 ID를 기반으로 책 상세 정보를 조회합니다.
     * @param id URL 경로에 포함된 책의 고유 ID
     * @return 책 정보 또는 404 Not Found
     */
    @GetMapping("/api/books/{id}") // {isbn} -> {id}
    public ResponseEntity<BookResponseDto.BookItem> getBookById(@PathVariable String id) {
        BookResponseDto.BookItem bookItem = bookApiService.getBookById(id);
        if (bookItem != null) {
            return ResponseEntity.ok(bookItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}