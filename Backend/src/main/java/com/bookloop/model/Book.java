
package com.bookloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 150)
    private String author;

    @Column(length = 50)
    private String isbn;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "genre", nullable = false)
    private String genre;

    @Column(name = "book_condition", nullable = false, length = 30)
    private String bookCondition = "GOOD";

    @Column(name = "listing_type", nullable = false, length = 30)
    private String listingType = "EXCHANGE";

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE";

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Book() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getBookCondition() { return bookCondition; }
    public void setBookCondition(String bookCondition) { this.bookCondition = bookCondition; }

    public String getListingType() { return listingType; }
    public void setListingType(String listingType) { this.listingType = listingType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) this.status = "AVAILABLE";
        if (this.bookCondition == null) this.bookCondition = "GOOD";
        if (this.listingType == null) this.listingType = "EXCHANGE";
        if (this.price == null) this.price = BigDecimal.ZERO;
        if (this.viewsCount == null) this.viewsCount = 0;

        if (this.category == null || this.category.isBlank()) {
            this.category = (this.genre != null && !this.genre.isBlank())
                    ? this.genre : "General";
        }

        if (this.genre == null || this.genre.isBlank()) {
            this.genre = this.category;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();

        if (this.category == null || this.category.isBlank()) {
            this.category = (this.genre != null && !this.genre.isBlank())
                    ? this.genre : "General";
        }

        if (this.genre == null || this.genre.isBlank()) {
            this.genre = this.category;
        }
    }
}
