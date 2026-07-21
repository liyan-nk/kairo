package com.kairo.backend.dto.response;

import java.util.UUID;

public class UserProfileResponse {

    private UUID id;
    private String email;
    private String name;
    private String rollNumber;
    private String department;
    private String semester;
    private String section;

    public UserProfileResponse() {
    }

    public UserProfileResponse(UUID id, String email, String name, String rollNumber, String department, String semester, String section) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.rollNumber = rollNumber;
        this.department = department;
        this.semester = semester;
        this.section = section;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public static UserProfileResponseBuilder builder() {
        return new UserProfileResponseBuilder();
    }

    public static class UserProfileResponseBuilder {
        private UUID id;
        private String email;
        private String name;
        private String rollNumber;
        private String department;
        private String semester;
        private String section;

        public UserProfileResponseBuilder id(UUID id) { this.id = id; return this; }
        public UserProfileResponseBuilder email(String email) { this.email = email; return this; }
        public UserProfileResponseBuilder name(String name) { this.name = name; return this; }
        public UserProfileResponseBuilder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public UserProfileResponseBuilder department(String department) { this.department = department; return this; }
        public UserProfileResponseBuilder semester(String semester) { this.semester = semester; return this; }
        public UserProfileResponseBuilder section(String section) { this.section = section; return this; }

        public UserProfileResponse build() {
            return new UserProfileResponse(id, email, name, rollNumber, department, semester, section);
        }
    }
}
