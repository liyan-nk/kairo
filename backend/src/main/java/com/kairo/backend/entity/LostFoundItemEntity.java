package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "lost_found_items")
public class LostFoundItemEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Column(name = "claimed_by_id")
    private UUID claimedById;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "item_date", nullable = false)
    private LocalDate itemDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private LostFoundStatusEnum status = LostFoundStatusEnum.LOST;

    @Column(name = "validation_question")
    private String validationQuestion;

    @Column(name = "validation_answer_hash")
    private String validationAnswerHash;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @Column(name = "claimed_at")
    private Instant claimedAt;

    public LostFoundItemEntity() {
    }

    public LostFoundItemEntity(UUID id, UUID reporterId, UUID claimedById, String title, String description, String category, String location, LocalDate itemDate, LostFoundStatusEnum status, String validationQuestion, String validationAnswerHash, String contactInfo, Instant claimedAt) {
        this.id = id;
        this.reporterId = reporterId;
        this.claimedById = claimedById;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.itemDate = itemDate;
        this.status = status;
        this.validationQuestion = validationQuestion;
        this.validationAnswerHash = validationAnswerHash;
        this.contactInfo = contactInfo;
        this.claimedAt = claimedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getReporterId() { return reporterId; }
    public void setReporterId(UUID reporterId) { this.reporterId = reporterId; }

    public UUID getClaimedById() { return claimedById; }
    public void setClaimedById(UUID claimedById) { this.claimedById = claimedById; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getItemDate() { return itemDate; }
    public void setItemDate(LocalDate itemDate) { this.itemDate = itemDate; }

    public LostFoundStatusEnum getStatus() { return status; }
    public void setStatus(LostFoundStatusEnum status) { this.status = status; }

    public String getValidationQuestion() { return validationQuestion; }
    public void setValidationQuestion(String validationQuestion) { this.validationQuestion = validationQuestion; }

    public String getValidationAnswerHash() { return validationAnswerHash; }
    public void setValidationAnswerHash(String validationAnswerHash) { this.validationAnswerHash = validationAnswerHash; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public Instant getClaimedAt() { return claimedAt; }
    public void setClaimedAt(Instant claimedAt) { this.claimedAt = claimedAt; }

    public static LostFoundItemEntityBuilder builder() {
        return new LostFoundItemEntityBuilder();
    }

    public static class LostFoundItemEntityBuilder {
        private UUID id;
        private UUID reporterId;
        private UUID claimedById;
        private String title;
        private String description;
        private String category;
        private String location;
        private LocalDate itemDate;
        private LostFoundStatusEnum status = LostFoundStatusEnum.LOST;
        private String validationQuestion;
        private String validationAnswerHash;
        private String contactInfo;
        private Instant claimedAt;

        public LostFoundItemEntityBuilder id(UUID id) { this.id = id; return this; }
        public LostFoundItemEntityBuilder reporterId(UUID reporterId) { this.reporterId = reporterId; return this; }
        public LostFoundItemEntityBuilder claimedById(UUID claimedById) { this.claimedById = claimedById; return this; }
        public LostFoundItemEntityBuilder title(String title) { this.title = title; return this; }
        public LostFoundItemEntityBuilder description(String description) { this.description = description; return this; }
        public LostFoundItemEntityBuilder category(String category) { this.category = category; return this; }
        public LostFoundItemEntityBuilder location(String location) { this.location = location; return this; }
        public LostFoundItemEntityBuilder itemDate(LocalDate itemDate) { this.itemDate = itemDate; return this; }
        public LostFoundItemEntityBuilder status(LostFoundStatusEnum status) { this.status = status; return this; }
        public LostFoundItemEntityBuilder validationQuestion(String validationQuestion) { this.validationQuestion = validationQuestion; return this; }
        public LostFoundItemEntityBuilder validationAnswerHash(String validationAnswerHash) { this.validationAnswerHash = validationAnswerHash; return this; }
        public LostFoundItemEntityBuilder contactInfo(String contactInfo) { this.contactInfo = contactInfo; return this; }
        public LostFoundItemEntityBuilder claimedAt(Instant claimedAt) { this.claimedAt = claimedAt; return this; }

        public LostFoundItemEntity build() {
            return new LostFoundItemEntity(id, reporterId, claimedById, title, description, category, location, itemDate, status, validationQuestion, validationAnswerHash, contactInfo, claimedAt);
        }
    }
}
