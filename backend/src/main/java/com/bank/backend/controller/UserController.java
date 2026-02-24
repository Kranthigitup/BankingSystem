package com.bank.backend.controller;

import com.bank.backend.dto.RegisterResponse;
import com.bank.backend.dto.AuthResponse;
import com.bank.backend.dto.RegisterRequest;
import com.bank.backend.dto.LoginRequest;
import com.bank.backend.model.User;
import com.bank.backend.model.Transaction;
import com.bank.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test() {
        return "Controller Working";
    }

    // ✅ FIXED REGISTER METHOD
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return userService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/deposit")
    public RegisterResponse deposit(@RequestParam("accountNumber") String accountNumber,
            @RequestParam("amount") double amount) {

        return userService.deposit(accountNumber, amount);
    }

    @PostMapping("/withdraw")
    public RegisterResponse withdraw(@RequestParam("accountNumber") String accountNumber,
            @RequestParam("amount") double amount) {

        return userService.withdraw(accountNumber, amount);
    }

    @PostMapping("/transfer")
    public RegisterResponse transfer(@RequestParam("fromAccount") String fromAccount,
            @RequestParam("toAccount") String toAccount,
            @RequestParam("amount") double amount) {
        return userService.transfer(fromAccount, toAccount, amount);
    }

    @GetMapping("/me")
    public RegisterResponse me() {
        return userService.me();
    }

    @GetMapping("/transactions")
    public List<Transaction> transactions() {
        return userService.myTransactions();
    }
}
