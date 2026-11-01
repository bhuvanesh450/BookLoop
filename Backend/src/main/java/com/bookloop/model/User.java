
package com.bookloop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String phone;
    private String department;
    private String college;

    private boolean verified = false;

    @JsonIgnore
    private String otp;

    @JsonIgnore
    private LocalDateTime otpExpiry;

    private String role = "ROLE_USER";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public User() {
    }

    // Manual Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {

        private Long id;
        private String name;
        private String email;
        private String password;
        private String phone;
        private String department;
        private String college;
        private boolean verified = false;
        private String otp;
        private LocalDateTime otpExpiry;
        private String role = "ROLE_USER";
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserBuilder department(String department) {
            this.department = department;
            return this;
        }

        public UserBuilder college(String college) {
            this.college = college;
            return this;
        }

        public UserBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public UserBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public UserBuilder otpExpiry(LocalDateTime otpExpiry) {
            this.otpExpiry = otpExpiry;
            return this;
        }

        public UserBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public User build() {
            User user = new User();
            user.setId(id);
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setPhone(phone);
            user.setDepartment(department);
            user.setCollege(college);
            user.setVerified(verified);
            user.setOtp(otp);
            user.setOtpExpiry(otpExpiry);
            user.setRole(role);
            user.setCreatedAt(createdAt);
            return user;
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
