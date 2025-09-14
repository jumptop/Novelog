package me.jumptop.novelog.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SurveyRequestDto {

    // 프론트에서 보낸 장르 목록을 이 리스트로 받기
    private List<String> genres;
}
