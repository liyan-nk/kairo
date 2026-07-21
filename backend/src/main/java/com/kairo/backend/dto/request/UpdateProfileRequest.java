package com.kairo.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String rollNumber;
    private String department;
    private String semester;
    private String section;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String name, String rollNumber, String department, String semester, String section) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.department = department;
        this.semester = semester;
        this.section = section;
    }

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

    public static UpdateProfileRequestBuilder builder() {
        return new UpdateProfileRequestBuilder();
    }

    public static class UpdateProfileRequestBuilder {
        private String name;
        private String rollNumber;
        private String department;
        private String semester;
        private String section;

        public UpdateProfileRequestBuilder name(String name) { this.name = name; return this; }
        public UpdateProfileRequestBuilder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public UpdateProfileRequestBuilder department(String department) { this.department = department; return this; }
        public UpdateProfileRequestBuilder semester(String semester) { this.semester = semester; return this; }
        public UpdateProfileRequestBuilder section(String section) { this.section = section; return this; }

        public UpdateProfileRequest build() {
            return new UpdateProfileRequest(name, rollNumber, department, semester, section);
        }
    }
}
