package com.bookloop.config;

import com.bookloop.model.Book;
import com.bookloop.model.User;
import com.bookloop.repository.BookRepository;
import com.bookloop.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${bookloop.demo.password:}")
    private String demoPassword;

    @Override
    public void run(String... args) {

        if (demoPassword == null || demoPassword.isBlank()) {
            System.out.println(
                    "[BOOKLOOP] Sample data is disabled. Set BOOKLOOP_DEMO_PASSWORD to enable it."
            );
            return;
        }

        // Create the campus contributor if it does not exist
        User campusContributor = userRepository
                .findByEmail("campus.shelf@bookloop.edu")
                .orElse(null);

        if (campusContributor == null) {

            campusContributor = new User();

            campusContributor.setName("Campus Book Bank");
            campusContributor.setEmail("campus.shelf@bookloop.edu");
            campusContributor.setPassword(
                    passwordEncoder.encode(demoPassword)
            );
            campusContributor.setPhone("+91 9876543210");
            campusContributor.setDepartment(
                    "Computer Science & Engineering"
            );
            campusContributor.setCollege("BTech Campus Library Hub");
            campusContributor.setVerified(true);
            campusContributor.setRole("ROLE_USER");

            campusContributor = userRepository.save(campusContributor);
        }

        // Do not insert duplicate sample books
        if (bookRepository.count() > 0) {
            System.out.println(
                    "[BOOKLOOP] Books already exist. Skipping sample data."
            );
            return;
        }

        List<Book> initialBooks = new ArrayList<>();

        initialBooks.add(createBook(
                "Introduction to Algorithms (CLRS)",
                "Thomas H. Cormen, Charles E. Leiserson",
                "978-0262033848",
                "Computer Science",
                "LIKE_NEW",
                "Comprehensive guide to algorithms and data structures. Highly recommended for 3rd year core subjects and technical placements.",
                "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        initialBooks.add(createBook(
                "Operating System Concepts (Silberschatz)",
                "Abraham Silberschatz, Peter B. Galvin",
                "978-1118063330",
                "Computer Science",
                "GOOD",
                "The dinosaur book on OS internals, process scheduling, virtual memory management, and file systems.",
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        initialBooks.add(createBook(
                "Artificial Intelligence: A Modern Approach",
                "Stuart Russell, Peter Norvig",
                "978-0136042594",
                "Artificial Intelligence",
                "NEW",
                "The authoritative reference on AI, search agents, probabilistic reasoning, and deep learning architectures.",
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        initialBooks.add(createBook(
                "Database System Concepts",
                "Abraham Silberschatz, Henry F. Korth",
                "978-0073523323",
                "Computer Science",
                "GOOD",
                "Fundamental concepts of database design, relational algebra, SQL optimization, and transaction processing.",
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        initialBooks.add(createBook(
                "Clean Code: A Handbook of Agile Software Craftsmanship",
                "Robert C. Martin",
                "978-0132350884",
                "Software Engineering",
                "LIKE_NEW",
                "Must-read for software engineering students. Covers naming, functions, refactoring, code smells, and SOLID principles.",
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        initialBooks.add(createBook(
                "Computer Networks (5th Edition)",
                "Andrew S. Tanenbaum, David J. Wetherall",
                "978-0132126953",
                "Computer Science",
                "GOOD",
                "Covers physical layer to application layer protocols, routing algorithms, TCP/IP congestion control, and wireless networks.",
                "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
                campusContributor
        ));

        bookRepository.saveAll(initialBooks);

        System.out.println(
                "[BOOKLOOP INITIALIZER] Successfully added 6 sample books."
        );
    }

    private Book createBook(
            String title,
            String author,
            String isbn,
            String category,
            String condition,
            String description,
            String imageUrl,
            User owner
    ) {

        Book book = new Book();

        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setCategory(category);
        book.setGenre(category);
        book.setBookCondition(condition);
        book.setDescription(description);
        book.setImageUrl(imageUrl);
        book.setStatus("AVAILABLE");
        book.setOwner(owner);

        return book;
    }
}