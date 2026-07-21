package com.kairo.backend.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "department")
    private String department;

    @Column(name = "semester")
    private String semester;

    @Column(name = "section")
    private String section;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role_name")
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles = new HashSet<>();

    public UserEntity() {
    }

    public UserEntity(UUID id, String email, String passwordHash, String name, String rollNumber, String department, String semester, String section, Set<UserRole> roles) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.rollNumber = rollNumber;
        this.department = department;
        this.semester = semester;
        this.section = section;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public Set<UserRole> getRoles() { return roles; }
    public void setRoles(Set<UserRole> roles) { this.roles = roles; }

    public static UserEntityBuilder builder() {
        return new UserEntityBuilder();
    }

    public static class UserEntityBuilder {
        private UUID id;
        private String email;
        private String passwordHash;
        private String name;
        private String rollNumber;
        private String department;
        private String semester;
        private String section;
        private Set<UserRole> roles = new HashSet<>();

        public UserEntityBuilder id(UUID id) { this.id = id; return this; }
        public UserEntityBuilder email(String email) { this.email = email; return this; }
        public UserEntityBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserEntityBuilder name(String name) { this.name = name; return this; }
        public UserEntityBuilder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public UserEntityBuilder department(String department) { this.department = department; return this; }
        public UserEntityBuilder semester(String semester) { this.semester = semester; return this; }
        public UserEntityBuilder section(String section) { this.section = section; return this; }
        public UserEntityBuilder roles(Set<UserRole> roles) { this.roles = roles; return this; }

        public UserEntity build() {
            return new UserEntity(id, email, passwordHash, name, rollNumber, department, semester, section, roles);
        }
    }
}
