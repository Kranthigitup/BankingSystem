package com.bank.backend.controller;

import com.bank.backend.dto.ChangePasswordRequest;
import com.bank.backend.dto.PasswordResetRequest;
import com.bank.backend.dto.ResetOtpResponse;
import com.bank.backend.dto.ResetPasswordRequest;
import com.bank.backend.dto.TokenResponse;
import com.bank.backend.model.User;
import com.bank.backend.repository.UserRepository;
import com.bank.backend.security.JwtService;
import com.bank.backend.security.PasswordResetService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          PasswordResetService passwordResetService,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
        this.jwtService = jwtService;
    }

    @PostMapping("/request-reset")
    public ResetOtpResponse requestReset(@RequestBody PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return new ResetOtpResponse("If the email exists, an OTP was sent.", null);
        }
        String otp = passwordResetService.generateOtp(user.getEmail());
        return new ResetOtpResponse("OTP generated (dev only).", otp);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        boolean ok = passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
        if (!ok) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password reset successful";
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        String email = getAuthenticatedEmail();
        if (email == null) {
            throw new RuntimeException("Unauthorized");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password updated";
    }

    @PostMapping("/refresh")
    public TokenResponse refreshToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new RuntimeException("Unauthorized");
        }
        String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER");
        String normalizedRole = role.replace("ROLE_", "");
        String subject = auth.getPrincipal().toString();
        String token = jwtService.generateToken(subject, normalizedRole);
        return new TokenResponse(token);
    }

    private String getAuthenticatedEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return null;
        }
        Object principal = auth.getPrincipal();
        return principal == null ? null : principal.toString();
    }
}
