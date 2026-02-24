package com.bank.backend.dto;

public class AdminAccountView {

    private Long id;
    private String accountNumber;
    private double balance;
    private Long userId;
    private String userEmail;

    public AdminAccountView(Long id, String accountNumber, double balance, Long userId, String userEmail) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.userId = userId;
        this.userEmail = userEmail;
    }

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserEmail() {
        return userEmail;
    }
}
