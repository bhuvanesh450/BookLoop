
package com.bookloop.service;

import com.bookloop.dto.BookRequest;
import com.bookloop.model.Book;
import com.bookloop.model.User;
import com.bookloop.repository.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getMyBooks(User user) {
        return bookRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Book> discoverBooks(User user, String genre, String search) {

        Long currentUserId = (user != null) ? user.getId() : -1L;

        return bookRepository.discoverBooks(
                currentUserId,
                (genre != null && !genre.isBlank()
                        && !genre.equalsIgnoreCase("All"))
                        ? genre.trim() : null,
                (search != null && !search.isBlank())
                        ? search.trim() : null
        );
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book with ID " + id + " not found."
                        )
                );
    }

    @Transactional
    public Book addBook(User user, BookRequest request) {

        String imageUrl = request.getImageUrl();

        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
        }

        String category = (request.getCategory() != null
                && !request.getCategory().isBlank())
                ? request.getCategory().trim()
                : (request.getGenre() != null
                        && !request.getGenre().isBlank()
                        ? request.getGenre().trim() : "General");

        String genre = (request.getGenre() != null
                && !request.getGenre().isBlank())
                ? request.getGenre().trim()
                : category;

        String listingType = request.getListingType();

        if (listingType == null || listingType.isBlank()) {
            listingType = "EXCHANGE";
        }

        listingType = listingType.trim().toUpperCase();

        if (!listingType.equals("SALE")
                && !listingType.equals("EXCHANGE")
                && !listingType.equals("DONATION")) {
            throw new IllegalArgumentException(
                    "Invalid listing type. Use SALE, EXCHANGE, or DONATION."
            );
        }

        Book book = new Book();

        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());

        book.setIsbn(request.getIsbn() != null
                ? request.getIsbn().trim() : null);

        book.setCategory(category);
        book.setGenre(genre);

        book.setBookCondition(
                request.getBookCondition() != null
                        && !request.getBookCondition().isBlank()
                        ? request.getBookCondition()
                        : "GOOD"
        );

        book.setDescription(request.getDescription());
        book.setImageUrl(imageUrl.trim());

        book.setStatus("AVAILABLE");
        book.setOwner(user);

        book.setListingType(listingType);

        book.setPrice(
                request.getPrice() != null
                        ? request.getPrice()
                        : BigDecimal.ZERO
        );

        book.setCity(request.getCity());

        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(User user, Long bookId, BookRequest request) {

        Book book = getBookById(bookId);

        if (!book.getOwner().getId().equals(user.getId())) {
            throw new SecurityException(
                    "Unauthorized: You do not own this book."
            );
        }

        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setIsbn(request.getIsbn());

        if (request.getCategory() != null
                && !request.getCategory().isBlank()) {
            book.setCategory(request.getCategory().trim());
        }

        if (request.getGenre() != null
                && !request.getGenre().isBlank()) {
            book.setGenre(request.getGenre().trim());
        }

        if (book.getCategory() == null) {
            book.setCategory(book.getGenre());
        }

        if (book.getGenre() == null) {
            book.setGenre(book.getCategory());
        }

        if (request.getBookCondition() != null) {
            book.setBookCondition(request.getBookCondition());
        }

        if (request.getDescription() != null) {
            book.setDescription(request.getDescription());
        }

        if (request.getImageUrl() != null
                && !request.getImageUrl().isBlank()) {
            book.setImageUrl(request.getImageUrl().trim());
        }

        if (request.getStatus() != null) {
            book.setStatus(request.getStatus());
        }

        if (request.getListingType() != null
                && !request.getListingType().isBlank()) {

            String listingType =
                    request.getListingType().trim().toUpperCase();

            if (!listingType.equals("SALE")
                    && !listingType.equals("EXCHANGE")
                    && !listingType.equals("DONATION")) {
                throw new IllegalArgumentException(
                        "Invalid listing type."
                );
            }

            book.setListingType(listingType);
        }

        if (request.getPrice() != null) {
            book.setPrice(request.getPrice());
        }

        if (request.getCity() != null) {
            book.setCity(request.getCity());
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(User user, Long bookId) {

        Book book = getBookById(bookId);

        if (!book.getOwner().getId().equals(user.getId())) {
            throw new SecurityException(
                    "Unauthorized: You do not own this book."
            );
        }

        if ("BORROWED".equalsIgnoreCase(book.getStatus())) {
            throw new IllegalStateException(
                    "Cannot delete a book that is currently lent out to a borrower."
            );
        }

        bookRepository.delete(book);
    }
}
