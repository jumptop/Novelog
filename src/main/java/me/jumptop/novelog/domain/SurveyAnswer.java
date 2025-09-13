package me.jumptop.novelog.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class SurveyAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 대다일 관계 설정. 여러개의 답변(SurveyAnswer)이 한 명의 사용자(User)에게 속함.
    // fetch = FetchType.LAZY는 User 객체를 실제로 사용할 때까지 DB에서 조회하지 않도록 하는 성능 최적화 설정.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB에 생성될 외래 키 이름 지정
    private User user;

    @Column(nullable = false)
    private String category; // 질문의 카테고리

    @Column(nullable = false)
    private String content;

    @Builder
    public SurveyAnswer(User user, String category, String content) {
        this.user = user;
        this.category = category;
        this.content = content;
    }
}
