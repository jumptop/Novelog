package me.jumptop.novelog.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 설정을 DB에 위임
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String picture;

    @Column(nullable = false)
    private boolean surveyCompleted;

    @Builder
    public User(String name, String email, String picture, boolean surveyCompleted) {
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.surveyCompleted = surveyCompleted;
    }

    public User update(String name, String picture) {
        this.name = name;
        this.picture = picture;
        return this;
    }

    public void completeSurvey() {
        this.surveyCompleted = true;
    }

    public void resetSurvey() {
        this.surveyCompleted = false;
    }
}
