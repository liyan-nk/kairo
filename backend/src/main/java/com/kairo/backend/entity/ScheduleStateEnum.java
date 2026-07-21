package com.kairo.backend.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ScheduleStateEnum {
    CURRENT("current"),
    BREAK("break"),
    FINISHED("finished"),
    EMPTY("empty");

    private final String value;

    ScheduleStateEnum(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
