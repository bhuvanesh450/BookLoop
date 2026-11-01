
package com.bookloop.service;

import com.bookloop.dto.BorrowActionRequest;
import com.bookloop.dto.DashboardStatsDto;
import com.bookloop.model.Book;
import com.bookloop.model.BorrowRequest;
import com.bookloop.model.User;
import com.bookloop.repository.BookRepository;
import com.bookloop.repository.BorrowRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    public BorrowRequest createRequest(
            User requester,
            BorrowActionRequest actionRequest) {

        Book book = bookRepository.findById(actionRequest.getBookId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Book not found."));

        if (book.getOwner().getId().equals(requester.getId())) {
            throw new IllegalArgumentException(
                    "You cannot borrow your own book.");
        }

        if (!"AVAILABLE".equalsIgnoreCase(book.getStatus())) {
            throw new IllegalStateException(
                    "Book is currently unavailable or already borrowed.");
        }

        Optional<BorrowRequest> existingPending =
                borrowRequestRepository
                        .findFirstByBookIdAndRequesterIdAndStatus(
                                book.getId(),
                                requester.getId(),
                                "PENDING");

        if (existingPending.isPresent()) {
            throw new IllegalStateException(
                    "You already have an active pending request for this book.");
        }

        // Create request without Lombok builder
        BorrowRequest request = new BorrowRequest();

        request.setBook(book);
        request.setRequester(requester);
        request.setOwner(book.getOwner());

        request.setDurationDays(
                actionRequest.getDurationDays() != null
                        ? actionRequest.getDurationDays()
                        : 14);

        request.setNote(actionRequest.getNote());
        request.setStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());

        return borrowRequestRepository.save(request);
    }

    public List<BorrowRequest> getIncomingRequests(User owner) {
        return borrowRequestRepository
                .findByOwnerIdOrderByRequestDateDesc(owner.getId());
    }

    public List<BorrowRequest> getMyRequests(User requester) {
        return borrowRequestRepository
                .findByRequesterIdOrderByRequestDateDesc(requester.getId());
    }

    @Transactional
    public BorrowRequest approveRequest(User owner, Long requestId) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Borrow request not found."));

        if (!request.getOwner().getId().equals(owner.getId())) {
            throw new SecurityException(
                    "Unauthorized: You are not the owner of this book.");
        }

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Request is not in PENDING state.");
        }

        Book book = request.getBook();

        if (!"AVAILABLE".equalsIgnoreCase(book.getStatus())) {
            throw new IllegalStateException(
                    "This book is no longer available.");
        }

        book.setStatus("BORROWED");
        bookRepository.save(book);

        request.setStatus("APPROVED");
        request.setResponseDate(LocalDateTime.now());
        request.setDueDate(
                LocalDateTime.now().plusDays(request.getDurationDays()));

        // Reject other pending requests for the same book
        List<BorrowRequest> otherRequests =
                borrowRequestRepository.findByBookId(book.getId());

        for (BorrowRequest other : otherRequests) {

            if (!other.getId().equals(request.getId())
                    && "PENDING".equalsIgnoreCase(other.getStatus())) {

                other.setStatus("REJECTED");
                other.setResponseDate(LocalDateTime.now());
                other.setRejectionReason(
                        "Book lent to another user.");

                borrowRequestRepository.save(other);
            }
        }

        return borrowRequestRepository.save(request);
    }

    @Transactional
    public BorrowRequest rejectRequest(
            User owner,
            Long requestId,
            String reason) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Borrow request not found."));

        if (!request.getOwner().getId().equals(owner.getId())) {
            throw new SecurityException(
                    "Unauthorized: You are not the owner of this book.");
        }

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Request is not in PENDING state.");
        }

        request.setStatus("REJECTED");
        request.setResponseDate(LocalDateTime.now());

        request.setRejectionReason(
                reason != null && !reason.isBlank()
                        ? reason
                        : "Owner declined request.");

        return borrowRequestRepository.save(request);
    }

    @Transactional
    public BorrowRequest returnBook(User user, Long requestId) {

        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Borrow request not found."));

        boolean isRequester =
                request.getRequester().getId().equals(user.getId());

        boolean isOwner =
                request.getOwner().getId().equals(user.getId());

        if (!isRequester && !isOwner) {
            throw new SecurityException(
                    "Unauthorized: Only the borrower or owner can mark this book as returned.");
        }

        if (!"APPROVED".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Only active APPROVED loans can be returned.");
        }

        request.setStatus("RETURNED");
        request.setReturnDate(LocalDateTime.now());

        // Restore book availability
        Book book = request.getBook();
        book.setStatus("AVAILABLE");

        bookRepository.save(book);

        return borrowRequestRepository.save(request);
    }

    public DashboardStatsDto getDashboardStats(User user) {

        long totalBooks =
                bookRepository.countByOwnerId(user.getId());

        long activeLendings =
                borrowRequestRepository.countByOwnerIdAndStatus(
                        user.getId(), "APPROVED");

        long activeBorrowings =
                borrowRequestRepository.countByRequesterIdAndStatus(
                        user.getId(), "APPROVED");

        long pendingIncoming =
                borrowRequestRepository.countByOwnerIdAndStatus(
                        user.getId(), "PENDING");

        long pendingOutgoing =
                borrowRequestRepository.countByRequesterIdAndStatus(
                        user.getId(), "PENDING");

        // Normal constructor instead of Lombok builder
        return new DashboardStatsDto(
                totalBooks,
                activeLendings,
                activeBorrowings,
                pendingIncoming,
                pendingOutgoing);
    }
}
