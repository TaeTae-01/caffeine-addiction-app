package com.example.caffein_addiction_app.auth.repository;

import com.example.caffein_addiction_app.auth.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByEmail(String email);
    User findByEmail(String email);
    @Query(value = "SELECT id FROM users WHERE email = :email", nativeQuery = true)
    Integer findIdByEmail(@Param("email")String email);
}
