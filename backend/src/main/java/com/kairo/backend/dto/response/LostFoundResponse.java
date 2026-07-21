package com.kairo.backend.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public class LostFoundResponse {

    private UUID id;
    private String title;
    private String description;
    private String category;
    private String location;
    private LocalDate date;
    private String status;
    private String question;
    private String contactInfo;

    public LostFoundResponse() {
    }

    public LostFoundResponse(UUID id, String title, String description, String category, String location, LocalDate date, String status, String question, String contactInfo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.date = date;
        this.status = status;
        this.question = question;
        this.contactInfo = contactInfo;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public static LostFoundResponseBuilder builder() {
        return new LostFoundResponseBuilder();
    }

    public static class LostFoundResponseBuilder {
        private UUID id;
        private String title;
        private String description;
        private String category;
        private String location;
        private LocalDate date;
        private String status;
        private String question;
        private String contactInfo;

        public LostFoundResponseBuilder id(UUID id) { this.id = id; return this; }
        public LostFoundResponseBuilder title(String title) { this.title = title; return this; }
        public LostFoundResponseBuilder description(String description) { this.description = description; return this; }
        public LostFoundResponseBuilder category(String category) { this.category = category; return this; }
        public LostFoundResponseBuilder location(String location) { this.location = location; return this; }
        public LostFoundResponseBuilder date(LocalDate date) { this.date = date; return this; }
        public LostFoundResponseBuilder status(String status) { this.status = status; return this; }
        public LostFoundResponseBuilder question(String question) { this.question = question; return this; }
        public LostFoundResponseBuilder contactInfo(String contactInfo) { this.contactInfo = contactInfo; return this; }

        public LostFoundResponse build() {
            return new LostFoundResponse(id, title, description, category, location, date, status, question, contactInfo);
        }
    }
}
