package com.kairo.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ClaimRequest {

    @NotBlank(message = "Claim answer validation is required")
    private String answer;

    public ClaimRequest() {
    }

    public ClaimRequest(String answer) {
        this.answer = answer;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
