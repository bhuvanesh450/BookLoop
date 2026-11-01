package com.bookloop.repository;

import com.bookloop.model.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    List<BorrowRequest> findByOwnerIdOrderByRequestDateDesc(Long ownerId);

    List<BorrowRequest> findByRequesterIdOrderByRequestDateDesc(Long requesterId);

    Optional<BorrowRequest> findFirstByBookIdAndRequesterIdAndStatus(Long bookId, Long requesterId, String status);

    long countByOwnerIdAndStatus(Long ownerId, String status);

    long countByRequesterIdAndStatus(Long requesterId, String status);

    List<BorrowRequest> findByBookId(Long bookId);
}
