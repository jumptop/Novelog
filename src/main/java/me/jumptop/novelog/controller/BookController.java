package me.jumptop.novelog.controller;

import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "네이버 도서 검색", description = "검색어를 기반으로 네이버 도서 API를 호출하여 책 목록을 반환")
    @GetMapping("/api/search/books")
    public BookResponseDto searchBooks(@RequestParam String query) {
        return bookApiService.searchBooks(query);
    }

    @GetMapping("/api/books/{isbn}")
    public ResponseEntity<BookResponseDto.BookItem> getBookByIsbn(@PathVariable String isbn) {
        // 기존의 네이버 검색 서비스를 재사용하여 ISBN으로 검색
        BookResponseDto searchResult = bookApiService.searchBooks(isbn);

        // 검색 결과가 있고, 결과 목록이 비어있지 않다면
        if (searchResult != null && !searchResult.getItems().isEmpty()) {
            // 첫 번째 검색 결과를 성공으로 반환
            return ResponseEntity.ok(searchResult.getItems().get(0));
        } else {
            // 검색 결과가 없으면 404 Not Found error 발생
            return ResponseEntity.notFound().build();
        }
    }
}
