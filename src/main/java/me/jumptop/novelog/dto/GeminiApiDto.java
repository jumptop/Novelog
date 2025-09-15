package me.jumptop.novelog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


public class GeminiApiDto {

    // 요청 DTO
    @Getter
    @AllArgsConstructor
    public static class Request {
        private List<Content> contents;
    }

    @Getter
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Getter
    @AllArgsConstructor
    public static class Part {
        private String text;
    }

    // 응답 DTO
    @Getter
    @NoArgsConstructor
    public static class Response {
        private List<Candidate> candidates;
    }

    @Getter
    @NoArgsConstructor
    public static class Candidate {
        private Content content;
    }

}
