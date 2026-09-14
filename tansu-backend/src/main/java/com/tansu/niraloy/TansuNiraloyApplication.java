package com.tansu.niraloy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TansuNiraloyApplication {
    public static void main(String[] args) {
        SpringApplication.run(TansuNiraloyApplication.class, args);
        System.out.println("================================================================");
        System.out.println("  🛡️ TANSU Niraloy Backend Server running at http://localhost:8080");
        System.out.println("  Connected to XAMPP MySQL Database: tansu_niraloy_db");
        System.out.println("================================================================");
    }
}
