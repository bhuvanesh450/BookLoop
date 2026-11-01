package com.bookloop.controller;

import com.bookloop.dto.ApiResponse;
import com.bookloop.dto.AuthRequest;
import com.bookloop.dto.DashboardStatsDto;
import com.bookloop.dto.UserDto;
import com.bookloop.model.User;
import com.bookloop.service.BorrowRequestService;
import com.bookloop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BorrowRequestService borrowRequestService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        User currentUser = userService.getAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.ok(UserDto.fromEntity(currentUser)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody AuthRequest.UpdateProfile request) {
        User currentUser = userService.getAuthenticatedUser();
        UserDto updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully!", updated));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        User currentUser = userService.getAuthenticatedUser();
        DashboardStatsDto stats = borrowRequestService.getDashboardStats(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
