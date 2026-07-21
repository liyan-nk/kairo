package com.kairo.backend.dto.response;

import java.util.UUID;

public class ClaimResponse {

    private UUID id;
    private String status;

    public ClaimResponse() {
    }

    public ClaimResponse(UUID id, String status) {
        this.id = id;
        this.status = status;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
