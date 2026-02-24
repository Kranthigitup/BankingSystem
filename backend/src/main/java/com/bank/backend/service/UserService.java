package com.bank.backend.service;

import com.bank.backend.model.User;


import com.bank.backend.model.Account;
import com.bank.backend.model.Transaction;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.repository.AccountRepository;
import com.bank.backend.repository.TransactionRepository;
import com.bank.backend.dto.RegisterResponse;
import com.bank.backend.dto.AuthResponse;
import com.bank.backend.security.JwtService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Random;
import java.util.List;
import java.time.LocalDateTime;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       TransactionRepository transactionRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    @Transactional
    public RegisterResponse deposit(String accountNumber, double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Deposit amount must be greater than zero");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber);

        if (account == null) {
            throw new RuntimeException("Account not found");
        }

        ensureAccountAccess(account);

        account.setBalance(account.getBalance() + amount);

        accountRepository.save(account);
        logTransaction("DEPOSIT", amount, account.getAccountNumber(), account.getAccountNumber());

        return new RegisterResponse(
                account.getUser().getName(),
                account.getAccountNumber(),
                account.getBalance()
        );
    }

    // ================= REGISTER =================
    public AuthResponse register(User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new RuntimeException("Email already exists");
        }

        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(0.0);
        account.setUser(savedUser);

        accountRepository.save(account);

        String token = jwtService.generateToken(savedUser.getEmail(), "USER");
        return new AuthResponse(
                savedUser.getName(),
                account.getAccountNumber(),
                account.getBalance(),
                token
        );
    }

    // ================= LOGIN (NEW METHOD ADDED) =================
    public AuthResponse login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        Account account = accountRepository.findByUser(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole() == null ? "USER" : user.getRole());
        return new AuthResponse(
                user.getName(),
                account.getAccountNumber(),
                account.getBalance(),
                token
        );
        
        
    }
    @Transactional
    public RegisterResponse withdraw(String accountNumber, double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Withdraw amount must be greater than zero");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber);

        if (account == null) {
            throw new RuntimeException("Account not found");
        }

        ensureAccountAccess(account);

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);

        accountRepository.save(account);
        logTransaction("WITHDRAW", amount, account.getAccountNumber(), account.getAccountNumber());

        return new RegisterResponse(
                account.getUser().getName(),
                account.getAccountNumber(),
                account.getBalance()
        );
        
    }
 // ✅ Transfer Method
    @Transactional
    public RegisterResponse transfer(String fromAccount,
                                     String toAccount,
                                     double amount) {

        if (amount <= 0) {
            throw new RuntimeException("Transfer amount must be greater than zero");
        }

        Account sender = accountRepository.findByAccountNumber(fromAccount);
        Account receiver = accountRepository.findByAccountNumber(toAccount);

        if (sender == null || receiver == null) {
            throw new RuntimeException("Invalid account number");
        }

        ensureAccountAccess(sender);

        if (sender.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct from sender
        sender.setBalance(sender.getBalance() - amount);

        // Add to receiver
        receiver.setBalance(receiver.getBalance() + amount);

        accountRepository.save(sender);
        accountRepository.save(receiver);
        logTransaction("TRANSFER", amount, sender.getAccountNumber(), receiver.getAccountNumber());

        return new RegisterResponse(
                sender.getUser().getName(),
                sender.getAccountNumber(),
                sender.getBalance()
        );
    }
    
    // ================= ACCOUNT NUMBER GENERATOR =================
    private String generateAccountNumber() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return "AC" + number;
    }

    private void ensureAccountAccess(Account account) {
        if (isAdmin()) {
            return;
        }
        String email = getAuthenticatedEmail();
        if (email == null || account.getUser() == null || !email.equals(account.getUser().getEmail())) {
            throw new RuntimeException("Unauthorized account access");
        }
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return false;
        }
        return auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private String getAuthenticatedEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return null;
        }
        Object principal = auth.getPrincipal();
        return principal == null ? null : principal.toString();
    }

    private void logTransaction(String type, double amount, String from, String to) {
        Transaction tx = new Transaction();
        tx.setType(type);
        tx.setAmount(amount);
        tx.setFromAccount(from);
        tx.setToAccount(to);
        tx.setDate(LocalDateTime.now());
        transactionRepository.save(tx);
    }

    public RegisterResponse me() {
        String email = getAuthenticatedEmail();
        if (email == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Account account = accountRepository.findByUser(user);
        if (account == null) {
            throw new RuntimeException("Account not found");
        }
        return new RegisterResponse(
                user.getName(),
                account.getAccountNumber(),
                account.getBalance()
        );
    }

    public List<Transaction> myTransactions() {
        String email = getAuthenticatedEmail();
        if (email == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Account account = accountRepository.findByUser(user);
        if (account == null) {
            throw new RuntimeException("Account not found");
        }
        return transactionRepository.findByFromAccountOrToAccount(
                account.getAccountNumber(),
                account.getAccountNumber()
        );
    }
}
