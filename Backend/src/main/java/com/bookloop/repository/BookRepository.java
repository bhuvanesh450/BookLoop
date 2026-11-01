package com.bookloop.repository;

import com.bookloop.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    long countByOwnerId(Long ownerId);

    @Query("SELECT b FROM Book b WHERE b.owner.id != :ownerId AND b.status = 'AVAILABLE' " +
           "AND (:genre IS NULL OR :genre = '' OR LOWER(b.genre) = LOWER(:genre) OR LOWER(b.category) = LOWER(:genre)) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY b.createdAt DESC")
    List<Book> discoverBooks(@Param("ownerId") Long ownerId,
                             @Param("genre") String genre,
                             @Param("search") String search);

    @Query("SELECT b FROM Book b WHERE b.status = 'AVAILABLE' ORDER BY b.createdAt DESC")
    List<Book> findAllAvailable();
}
