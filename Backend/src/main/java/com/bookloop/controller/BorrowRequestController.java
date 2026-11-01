package com.bookloop.controller;

import com.bookloop.dto.ApiResponse;
import com.bookloop.dto.BorrowActionRequest;
import com.bookloop.model.BorrowRequest;
import com.bookloop.model.User;
import com.bookloop.service.BorrowRequestService;
import com.bookloop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService borrowRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<BorrowRequest>> createRequest(@Valid @RequestBody BorrowActionRequest request) {
        User currentUser = userService.getAuthenticatedUser();
        BorrowRequest created = borrowRequestService.createRequest(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Borrow request submitted successfully!", created));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<List<BorrowRequest>>> getIncomingRequests() {
        User currentUser = userService.getAuthenticatedUser();
        List<BorrowRequest> list = borrowRequestService.getIncomingRequests(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BorrowRequest>>> getMyRequests() {
        User currentUser = userService.getAuthenticatedUser();
        List<BorrowRequest> list = borrowRequestService.getMyRequests(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<BorrowRequest>> approveRequest(@PathVariable Long id) {
        User currentUser = userService.getAuthenticatedUser();
        BorrowRequest approved = borrowRequestService.approveRequest(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok("Borrow request approved! Book is now lent out.", approved));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BorrowRequest>> rejectRequest(
            @PathVariable Long id,
            @RequestBody(required = false) BorrowActionRequest actionRequest) {
        User currentUser = userService.getAuthenticatedUser();
        String reason = (actionRequest != null) ? actionRequest.getReason() : null;
        BorrowRequest rejected = borrowRequestService.rejectRequest(currentUser, id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Borrow request rejected.", rejected));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<ApiResponse<BorrowRequest>> returnBook(@PathVariable Long id) {
        User currentUser = userService.getAuthenticatedUser();
        BorrowRequest returned = borrowRequestService.returnBook(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok("Book returned successfully! It is now available in collection.", returned));
    }
}
