package com.bookloop.controller;

import com.bookloop.dto.ApiResponse;
import com.bookloop.dto.AuthRequest;
import com.bookloop.dto.AuthResponse;
import com.bookloop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * User enters Name, Email, Password. An OTP is generated and sent to email.
     */
    @PostMapping("/register-or-login")
    public ResponseEntity<AuthResponse> registerOrLogin(@Valid @RequestBody AuthRequest.LoginOrRegister request) {
        AuthResponse response = userService.loginOrRegister(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * User verifies 6-digit OTP code to complete authentication.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody AuthRequest.VerifyOtp request) {
        AuthResponse response = userService.verifyOtp(request.getEmail(), request.getOtp());
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Resends a fresh OTP code.
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@Valid @RequestBody AuthRequest.ResendOtp request) {
        AuthResponse response = userService.resendOtp(request.getEmail());
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Direct login with password (for verified users or returning sessions).
     */
    @PostMapping("/direct-login")
    public ResponseEntity<AuthResponse> directLogin(@Valid @RequestBody AuthRequest.DirectLogin request) {
        AuthResponse response = userService.directLogin(request.getEmail(), request.getPassword());
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
