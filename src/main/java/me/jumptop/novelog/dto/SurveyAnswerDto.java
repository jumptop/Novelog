package me.jumptop.novelog.dto;

import lombok.Getter;
import me.jumptop.novelog.domain.SurveyAnswer;

@Getter
public class SurveyAnswerDto {
    private String category;
    private String content;

    public SurveyAnswerDto(SurveyAnswer entity) {
        this.category = entity.getCategory();
        this.content = entity.getContent();
    }
}
