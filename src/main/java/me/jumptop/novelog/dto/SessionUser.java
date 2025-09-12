package me.jumptop.novelog.dto;

import lombok.Getter;
import me.jumptop.novelog.domain.User;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable { // 직렬화 기능을 가진 세션 DTO

    private String name;
    private String email;
    private String picture;
    private boolean surveyCompleted;

    public SessionUser(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.picture = user.getPicture();
        this.surveyCompleted = user.isSurveyCompleted();
    }
}
