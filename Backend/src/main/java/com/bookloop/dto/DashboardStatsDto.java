
package com.bookloop.dto;

public class DashboardStatsDto {

    private long totalBooks;
    private long activeLendings;
    private long activeBorrowings;
    private long pendingIncomingRequests;
    private long pendingMyRequests;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(
            long totalBooks,
            long activeLendings,
            long activeBorrowings,
            long pendingIncomingRequests,
            long pendingMyRequests) {

        this.totalBooks = totalBooks;
        this.activeLendings = activeLendings;
        this.activeBorrowings = activeBorrowings;
        this.pendingIncomingRequests = pendingIncomingRequests;
        this.pendingMyRequests = pendingMyRequests;
    }

    public static DashboardStatsDtoBuilder builder() {
        return new DashboardStatsDtoBuilder();
    }

    public static class DashboardStatsDtoBuilder {

        private long totalBooks;
        private long activeLendings;
        private long activeBorrowings;
        private long pendingIncomingRequests;
        private long pendingMyRequests;

        public DashboardStatsDtoBuilder totalBooks(long value) {
            this.totalBooks = value;
            return this;
        }

        public DashboardStatsDtoBuilder activeLendings(long value) {
            this.activeLendings = value;
            return this;
        }

        public DashboardStatsDtoBuilder activeBorrowings(long value) {
            this.activeBorrowings = value;
            return this;
        }

        public DashboardStatsDtoBuilder pendingIncomingRequests(long value) {
            this.pendingIncomingRequests = value;
            return this;
        }

        public DashboardStatsDtoBuilder pendingMyRequests(long value) {
            this.pendingMyRequests = value;
            return this;
        }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(
                    totalBooks,
                    activeLendings,
                    activeBorrowings,
                    pendingIncomingRequests,
                    pendingMyRequests
            );
        }
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getActiveLendings() {
        return activeLendings;
    }

    public void setActiveLendings(long activeLendings) {
        this.activeLendings = activeLendings;
    }

    public long getActiveBorrowings() {
        return activeBorrowings;
    }

    public void setActiveBorrowings(long activeBorrowings) {
        this.activeBorrowings = activeBorrowings;
    }

    public long getPendingIncomingRequests() {
        return pendingIncomingRequests;
    }

    public void setPendingIncomingRequests(long pendingIncomingRequests) {
        this.pendingIncomingRequests = pendingIncomingRequests;
    }

    public long getPendingMyRequests() {
        return pendingMyRequests;
    }

    public void setPendingMyRequests(long pendingMyRequests) {
        this.pendingMyRequests = pendingMyRequests;
    }
}
