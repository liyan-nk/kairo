package com.kairo.backend.dto.request;

import com.kairo.backend.entity.AttendanceStatusEnum;
import jakarta.validation.constraints.NotNull;

public class UpdateAttendanceRequest {

    @NotNull(message = "Attendance status is required")
    private AttendanceStatusEnum status;

    private String notes;

    public UpdateAttendanceRequest() {
    }

    public UpdateAttendanceRequest(AttendanceStatusEnum status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public AttendanceStatusEnum getStatus() { return status; }
    public void setStatus(AttendanceStatusEnum status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static UpdateAttendanceRequestBuilder builder() {
        return new UpdateAttendanceRequestBuilder();
    }

    public static class UpdateAttendanceRequestBuilder {
        private AttendanceStatusEnum status;
        private String notes;

        public UpdateAttendanceRequestBuilder status(AttendanceStatusEnum status) { this.status = status; return this; }
        public UpdateAttendanceRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public UpdateAttendanceRequest build() {
            return new UpdateAttendanceRequest(status, notes);
        }
    }
}
