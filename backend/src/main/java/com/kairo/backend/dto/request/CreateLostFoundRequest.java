package com.kairo.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CreateLostFoundRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Item date is required")
    private LocalDate date;

    @NotBlank(message = "Validation question is required")
    private String question;

    @NotBlank(message = "Validation answer is required")
    private String answer;

    @NotBlank(message = "Contact info is required")
    private String contactInfo;

    public CreateLostFoundRequest() {
    }

    public CreateLostFoundRequest(String title, String description, String category, String location, LocalDate date, String question, String answer, String contactInfo) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.date = date;
        this.question = question;
        this.answer = answer;
        this.contactInfo = contactInfo;
    }

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

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public static CreateLostFoundRequestBuilder builder() {
        return new CreateLostFoundRequestBuilder();
    }

    public static class CreateLostFoundRequestBuilder {
        private String title;
        private String description;
        private String category;
        private String location;
        private LocalDate date;
        private String question;
        private String answer;
        private String contactInfo;

        public CreateLostFoundRequestBuilder title(String title) { this.title = title; return this; }
        public CreateLostFoundRequestBuilder description(String description) { this.description = description; return this; }
        public CreateLostFoundRequestBuilder category(String category) { this.category = category; return this; }
        public CreateLostFoundRequestBuilder location(String location) { this.location = location; return this; }
        public CreateLostFoundRequestBuilder date(LocalDate date) { this.date = date; return this; }
        public CreateLostFoundRequestBuilder question(String question) { this.question = question; return this; }
        public CreateLostFoundRequestBuilder answer(String answer) { this.answer = answer; return this; }
        public CreateLostFoundRequestBuilder contactInfo(String contactInfo) { this.contactInfo = contactInfo; return this; }

        public CreateLostFoundRequest build() {
            return new CreateLostFoundRequest(title, description, category, location, date, question, answer, contactInfo);
        }
    }
}
