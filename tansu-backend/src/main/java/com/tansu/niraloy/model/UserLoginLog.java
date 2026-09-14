package com.tansu.niraloy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_logins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(length = 30)
    private String role;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(nullable = false, length = 50)
    private String status; // "SUCCESS", "FAILED - NO ACCOUNT", "FAILED - INVALID PASSWORD"

    @PrePersist
    protected void onCreate() {
        if (this.loginTime == null) {
            this.loginTime = LocalDateTime.now();
        }
    }
}
