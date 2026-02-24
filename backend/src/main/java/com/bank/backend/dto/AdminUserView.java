package com.bank.backend.dto;

import java.time.LocalDateTime;

public class AdminUserView {

    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private String accountNumber;
    private double balance;

    public AdminUserView() {
    }

    public AdminUserView(Long id, String name, String email, String role, LocalDateTime createdAt,
            LocalDateTime lastLoginAt, String accountNumber, double balance) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }
}
