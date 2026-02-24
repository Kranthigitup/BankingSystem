package com.bank.backend.dto;

public class AuthResponse {

    private String name;
    private String accountNumber;
    private double balance;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(String name, String accountNumber, double balance, String token) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public String getToken() {
        return token;
    }
}
