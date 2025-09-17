package me.jumptop.novelog.repository;

import me.jumptop.novelog.domain.Journal;
import me.jumptop.novelog.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JournalRepository extends JpaRepository<Journal, Long> {
    List<Journal> findAllByUserOrderByCreatedAtDesc(User user);
}
