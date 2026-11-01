package com.bookloop.controller;

import com.bookloop.dto.ApiResponse;
import com.bookloop.dto.BookRequest;
import com.bookloop.model.Book;
import com.bookloop.model.User;
import com.bookloop.service.BookService;
import com.bookloop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Book>>> getMyBooks() {
        User currentUser = userService.getAuthenticatedUser();
        List<Book> books = bookService.getMyBooks(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(books));
    }

    @GetMapping("/discover")
    public ResponseEntity<ApiResponse<List<Book>>> discoverBooks(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String search) {
        User currentUser = userService.getAuthenticatedUser();
        List<Book> books = bookService.discoverBooks(currentUser, genre, search);
        return ResponseEntity.ok(ApiResponse.ok(books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.ok(book));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Book>> addBook(@Valid @RequestBody BookRequest request) {
        User currentUser = userService.getAuthenticatedUser();
        Book savedBook = bookService.addBook(currentUser, request);
        return ResponseEntity.ok(ApiResponse.ok("Book added to collection successfully!", savedBook));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request) {
        User currentUser = userService.getAuthenticatedUser();
        Book updatedBook = bookService.updateBook(currentUser, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Book updated successfully!", updatedBook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        User currentUser = userService.getAuthenticatedUser();
        bookService.deleteBook(currentUser, id);
        return ResponseEntity.ok(ApiResponse.ok("Book removed from collection successfully!", null));
    }
}
