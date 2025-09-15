package me.jumptop.novelog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SurveyRequestDto {
    // 1페이지: 장르 목록
    private List<String> genres;
    // 2페이지: 인생 책
    private String favoriteBook;
}