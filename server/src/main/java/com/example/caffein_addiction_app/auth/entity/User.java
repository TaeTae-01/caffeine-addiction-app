package com.example.caffein_addiction_app.auth.entity;

import com.example.caffein_addiction_app.auth.dto.request.EditUserInfoRequestDto;
import com.example.caffein_addiction_app.auth.dto.request.RegisterRequestDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "daily_caffeine_limit")
    private Integer dailyCaffeineLimit;

    public User(RegisterRequestDto dto, String encodedPassword) {
        this.email = dto.getEmail();
        this.password = encodedPassword;
        this.name = dto.getName();
        this.weight = dto.getWeight();
        this.dailyCaffeineLimit = dto.getDailyCaffeineLimit();
    }

    public void editUserInfo(EditUserInfoRequestDto dto){
        this.email = dto.getEmail();
        this.name = dto.getName();
        this.weight = dto.getWeight();
        this.dailyCaffeineLimit = dto.getDailyCaffeineLimit();
    }
}
