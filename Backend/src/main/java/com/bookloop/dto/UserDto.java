
package com.bookloop.dto;

import com.bookloop.model.User;
import java.time.LocalDateTime;

public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String college;
    private boolean verified;
    private String role;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(Long id, String name, String email, String phone,
                   String department, String college, boolean verified,
                   String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.college = college;
        this.verified = verified;
        this.role = role;
        this.createdAt = createdAt;
    }

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Entity to DTO conversion
    public static UserDto fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getDepartment(),
            user.getCollege(),
            user.isVerified(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
