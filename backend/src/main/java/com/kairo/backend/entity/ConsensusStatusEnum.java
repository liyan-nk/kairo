package com.kairo.backend.entity;

public enum ConsensusStatusEnum {
    PENDING("Pending"),
    LIKELY("Likely"),
    VERIFIED("Verified"),
    AUTO_ACCEPTED("Auto Accepted");

    private final String displayName;

    ConsensusStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
