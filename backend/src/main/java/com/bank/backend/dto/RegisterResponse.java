package com.bank.backend.dto;

public class RegisterResponse {

    private String name;
    private String accountNumber;
    private double balance;

    public RegisterResponse() {
    }

    public RegisterResponse(String name, String accountNumber, double balance) {
        this.name = name;
        this.accountNumber = accountNumber;
        this.balance = balance;
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
}