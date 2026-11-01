package com.bookloop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BookloopApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookloopApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  BOOKLOOP BACKEND STARTED SUCCESSFULLY on :8080 ");
        System.out.println("=================================================");
    }
}
