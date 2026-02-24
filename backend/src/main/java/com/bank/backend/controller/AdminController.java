package com.bank.backend.controller;

import com.bank.backend.dto.AdminAccountView;
import com.bank.backend.dto.AdminLoginRequest;
import com.bank.backend.dto.AdminResetPasswordRequest;
import com.bank.backend.dto.AdminUserView;
import com.bank.backend.dto.TokenResponse;
import com.bank.backend.model.Account;
import com.bank.backend.model.Transaction;
import com.bank.backend.model.User;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.TransactionRepository;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final String adminUsername;
    private final String adminPassword;
    private final long adminExpirationMinutes;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AdminController(@Value("${admin.username}") String adminUsername,
            @Value("${admin.password}") String adminPassword,
            @Value("${security.jwt.admin-expiration-minutes:43200}") long adminExpirationMinutes,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.adminExpirationMinutes = adminExpirationMinutes;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody AdminLoginRequest request) {
        if (!adminUsername.equals(request.getUsername())) {
            throw new RuntimeException("Invalid admin credentials (U)");
        }
        if (!passwordEncoder.matches(request.getPassword(), adminPassword)) {
            throw new RuntimeException("Invalid admin credentials (P)");
        }
        String token = jwtService.generateTokenWithExpiration("admin", "ADMIN", adminExpirationMinutes);
        return new TokenResponse(token);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserView> users() {
        List<User> users = userRepository.findAll();
        List<AdminUserView> views = new ArrayList<>();
        for (User user : users) {
            Account account = accountRepository.findByUser(user);
            String accountNumber = account == null ? null : account.getAccountNumber();
            double balance = account == null ? 0.0 : account.getBalance();
            views.add(new AdminUserView(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt(),
                    user.getLastLoginAt(),
                    accountNumber,
                    balance));
        }
        return views;
    }

    @GetMapping("/accounts")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminAccountView> accounts() {
        List<Account> accounts = accountRepository.findAll();
        List<AdminAccountView> views = new ArrayList<>();
        for (Account account : accounts) {
            Long userId = account.getUser() == null ? null : account.getUser().getId();
            String userEmail = account.getUser() == null ? null : account.getUser().getEmail();
            views.add(new AdminAccountView(
                    account.getId(),
                    account.getAccountNumber(),
                    account.getBalance(),
                    userId,
                    userEmail));
        }
        return views;
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Transaction> transactions() {
        return transactionRepository.findAll();
    }

    @PostMapping("/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public String resetPassword(@RequestBody AdminResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password reset successful";
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public String deleteUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        List<Account> accounts = accountRepository.findAllByUser(user);
        for (Account account : accounts) {
            String accountNumber = account.getAccountNumber();
            if (accountNumber != null) {
                transactionRepository.deleteByFromAccountOrToAccount(accountNumber, accountNumber);
            }
        }
        if (!accounts.isEmpty()) {
            accountRepository.deleteAll(accounts);
        }
        userRepository.delete(user);
        return "User deleted";
    }
}
