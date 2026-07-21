package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "enrollments")
public class EnrollmentEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    private CourseEntity course;

    @Column(name = "attended_classes", nullable = false)
    private int attendedClasses = 0;

    @Column(name = "total_classes", nullable = false)
    private int totalClasses = 0;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public EnrollmentEntity() {
    }

    public EnrollmentEntity(UUID id, UUID userId, UUID courseId, CourseEntity course, int attendedClasses, int totalClasses, Long version) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.course = course;
        this.attendedClasses = attendedClasses;
        this.totalClasses = totalClasses;
        this.version = version != null ? version : 0L;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }

    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public static EnrollmentEntityBuilder builder() {
        return new EnrollmentEntityBuilder();
    }

    public static class EnrollmentEntityBuilder {
        private UUID id;
        private UUID userId;
        private UUID courseId;
        private CourseEntity course;
        private int attendedClasses = 0;
        private int totalClasses = 0;
        private Long version = 0L;

        public EnrollmentEntityBuilder id(UUID id) { this.id = id; return this; }
        public EnrollmentEntityBuilder userId(UUID userId) { this.userId = userId; return this; }
        public EnrollmentEntityBuilder courseId(UUID courseId) { this.courseId = courseId; return this; }
        public EnrollmentEntityBuilder course(CourseEntity course) { this.course = course; return this; }
        public EnrollmentEntityBuilder attendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; return this; }
        public EnrollmentEntityBuilder totalClasses(int totalClasses) { this.totalClasses = totalClasses; return this; }
        public EnrollmentEntityBuilder version(Long version) { this.version = version; return this; }

        public EnrollmentEntity build() {
            return new EnrollmentEntity(id, userId, courseId, course, attendedClasses, totalClasses, version);
        }
    }
}
