package com.bookloop.service;

import com.bookloop.dto.AuthRequest;
import com.bookloop.dto.AuthResponse;
import com.bookloop.dto.UserDto;
import com.bookloop.model.User;
import com.bookloop.repository.UserRepository;
import com.bookloop.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Value("${bookloop.otp.expiration-minutes:10}")
    private int otpExpirationMinutes;

    private final SecureRandom random = new SecureRandom();

    /**
     * Unified authentication handler:
     * User enters Name, Email, Password.
     * Generates a 6-digit OTP and dispatches to email for verification.
     */
    @Transactional
    public AuthResponse loginOrRegister(AuthRequest.LoginOrRegister request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Invalid email or password.")
                        .build();
            }

            // Update details if provided
            if (request.getName() != null && !request.getName().isBlank()) {
                user.setName(request.getName().trim());
            }
            if (request.getPhone() != null) user.setPhone(request.getPhone());
            if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
            if (request.getCollege() != null) user.setCollege(request.getCollege());

        } else {
            // New user registration
            String name = request.getName();
            if (name == null || name.isBlank()) {
                name = email.split("@")[0];
            }

            user = User.builder()
                    .name(name.trim())
                    .email(email)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .department(request.getDepartment())
                    .college(request.getCollege())
                    .verified(false)
                    .role("ROLE_USER")
                    .build();
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
        userRepository.save(user);

        // Send OTP
        emailService.sendOtpEmail(user.getEmail(), otp, user.getName());

        return AuthResponse.builder()
                .success(true)
                .message("Authentication code (OTP) sent to " + email)
                .requiresOtp(true)
                .email(email)
                .build();
    }

    /**
     * Verifies the 6-digit OTP and generates JWT session token.
     */
    @Transactional
    public AuthResponse verifyOtp(String email, String otp) {
        String cleanEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("User not found.")
                    .build();
        }

        User user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return AuthResponse.builder()
                    .success(false)
                    .message("No active OTP request found. Please request a new code.")
                    .build();
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("OTP has expired. Please request a new one.")
                    .build();
        }

        if (!user.getOtp().equals(otp.trim())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Incorrect OTP code. Please check and try again.")
                    .build();
        }

        // OTP verified successfully
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .success(true)
                .message("Login successful!")
                .token(token)
                .user(UserDto.fromEntity(user))
                .requiresOtp(false)
                .email(user.getEmail())
                .build();
    }

    /**
     * Resends a fresh OTP.
     */
    @Transactional
    public AuthResponse resendOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("User not found.")
                    .build();
        }

        User user = userOpt.get();
        String otp = String.format("%06d", random.nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp, user.getName());

        return AuthResponse.builder()
                .success(true)
                .message("A new OTP has been sent to " + cleanEmail)
                .requiresOtp(true)
                .email(cleanEmail)
                .build();
    }

    /**
     * Direct login option (if user is already verified and prefers instant login with password)
     */
    @Transactional(readOnly = true)
    public AuthResponse directLogin(String email, String password) {
        String cleanEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Account not found. Please sign in with OTP verification.")
                    .build();
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password.")
                    .build();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return AuthResponse.builder()
                .success(true)
                .message("Welcome back!")
                .token(token)
                .user(UserDto.fromEntity(user))
                .requiresOtp(false)
                .email(user.getEmail())
                .build();
    }

    /**
     * Updates user profile and optional password change.
     */
    @Transactional
    public UserDto updateProfile(User currentUser, AuthRequest.UpdateProfile request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment().trim());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege().trim());
        }

        // Change password if requested
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null ||
                    !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password does not match.");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return UserDto.fromEntity(saved);
    }

    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            throw new RuntimeException("Unauthorized: No authenticated user session found.");
        }
        return (User) auth.getPrincipal();
    }
}
