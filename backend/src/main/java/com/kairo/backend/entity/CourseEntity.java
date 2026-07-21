package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "courses")
public class CourseEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "term_id", nullable = false)
    private UUID termId;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "room")
    private String room;

    public CourseEntity() {
    }

    public CourseEntity(UUID id, UUID termId, String code, String name, String faculty, String room) {
        this.id = id;
        this.termId = termId;
        this.code = code;
        this.name = name;
        this.faculty = faculty;
        this.room = room;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTermId() { return termId; }
    public void setTermId(UUID termId) { this.termId = termId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public static CourseEntityBuilder builder() {
        return new CourseEntityBuilder();
    }

    public static class CourseEntityBuilder {
        private UUID id;
        private UUID termId;
        private String code;
        private String name;
        private String faculty;
        private String room;

        public CourseEntityBuilder id(UUID id) { this.id = id; return this; }
        public CourseEntityBuilder termId(UUID termId) { this.termId = termId; return this; }
        public CourseEntityBuilder code(String code) { this.code = code; return this; }
        public CourseEntityBuilder name(String name) { this.name = name; return this; }
        public CourseEntityBuilder faculty(String faculty) { this.faculty = faculty; return this; }
        public CourseEntityBuilder room(String room) { this.room = room; return this; }

        public CourseEntity build() {
            return new CourseEntity(id, termId, code, name, faculty, room);
        }
    }
}
