package me.jumptop.novelog.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Journal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String bookTitle;

    @Column(nullable = false)
    private String bookIsbn;

    @Column(length = 500)
    private String bookImage;

    @Column(columnDefinition = "TEXT")
    private String userNotes;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String aiJournal;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Journal(User user, String bookTitle, String bookIsbn, String bookImage, String userNotes, String aiJournal) {
        this.user = user;
        this.bookTitle = bookTitle;
        this.bookIsbn = bookIsbn;
        this.bookImage = bookImage;
        this.userNotes = userNotes;
        this.aiJournal = aiJournal;
    }
}
