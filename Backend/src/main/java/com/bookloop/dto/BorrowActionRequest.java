
package com.bookloop.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowActionRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Integer durationDays = 14;

    private String note;

    private String reason;

    public BorrowActionRequest() {
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
