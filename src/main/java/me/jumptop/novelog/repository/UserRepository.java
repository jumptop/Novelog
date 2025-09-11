package me.jumptop.novelog.repository;

import me.jumptop.novelog.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// JpaRepository를 extend 받았기 때문에 @Repository 애노테이션을 작성하지 않아도 된다.
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
