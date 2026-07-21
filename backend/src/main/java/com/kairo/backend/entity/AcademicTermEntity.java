package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "academic_terms")
public class AcademicTermEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public AcademicTermEntity() {
    }

    public AcademicTermEntity(UUID id, String code, String name, LocalDate startDate, LocalDate endDate, boolean isActive) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public static AcademicTermEntityBuilder builder() {
        return new AcademicTermEntityBuilder();
    }

    public static class AcademicTermEntityBuilder {
        private UUID id;
        private String code;
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean isActive = true;

        public AcademicTermEntityBuilder id(UUID id) { this.id = id; return this; }
        public AcademicTermEntityBuilder code(String code) { this.code = code; return this; }
        public AcademicTermEntityBuilder name(String name) { this.name = name; return this; }
        public AcademicTermEntityBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public AcademicTermEntityBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public AcademicTermEntityBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }

        public AcademicTermEntity build() {
            return new AcademicTermEntity(id, code, name, startDate, endDate, isActive);
        }
    }
}
