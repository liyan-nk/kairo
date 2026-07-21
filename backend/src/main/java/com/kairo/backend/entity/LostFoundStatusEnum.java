package com.kairo.backend.entity;

public enum LostFoundStatusEnum {
    LOST("Lost"),
    FOUND("Found"),
    CLAIMED("Claimed");

    private final String displayName;

    LostFoundStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
