
package com.bookloop.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDto user;
    private boolean requiresOtp;
    private String email;
    private String devOtp;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String token,
                        UserDto user, boolean requiresOtp,
                        String email, String devOtp) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
        this.requiresOtp = requiresOtp;
        this.email = email;
        this.devOtp = devOtp;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public UserDto getUser() {
        return user;
    }

    public boolean isRequiresOtp() {
        return requiresOtp;
    }

    public String getEmail() {
        return email;
    }

    public String getDevOtp() {
        return devOtp;
    }

    // Setters
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public void setRequiresOtp(boolean requiresOtp) {
        this.requiresOtp = requiresOtp;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDevOtp(String devOtp) {
        this.devOtp = devOtp;
    }

    // Manual Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {

        private boolean success;
        private String message;
        private String token;
        private UserDto user;
        private boolean requiresOtp;
        private String email;
        private String devOtp;

        public AuthResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public AuthResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder user(UserDto user) {
            this.user = user;
            return this;
        }

        public AuthResponseBuilder requiresOtp(boolean requiresOtp) {
            this.requiresOtp = requiresOtp;
            return this;
        }

        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponseBuilder devOtp(String devOtp) {
            this.devOtp = devOtp;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(
                success, message, token, user,
                requiresOtp, email, devOtp
            );
        }
    }
}
