package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.LostFoundResponse;
import com.kairo.backend.entity.LostFoundItemEntity;

public class LostFoundMapper {

    public static LostFoundResponse toResponse(LostFoundItemEntity item) {
        if (item == null) {
            return null;
        }

        return LostFoundResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .category(item.getCategory())
                .location(item.getLocation())
                .date(item.getItemDate())
                .status(item.getStatus().getDisplayName())
                .question(item.getValidationQuestion())
                .contactInfo(item.getContactInfo())
                .build();
    }
}
