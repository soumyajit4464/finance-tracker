package com.financetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinanceTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinanceTrackerApplication.class, args);
        System.out.println("\n\n");
        System.out.println("=================================================");
        System.out.println("   Finance Tracker Backend is running! 🚀");
        System.out.println("   Access at: http://localhost:8080");
        System.out.println("=================================================");
        System.out.println("\n\n");
    }
}
