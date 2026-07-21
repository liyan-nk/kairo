package com.kairo.backend.mapper;

import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toUserProfileResponse(UserEntity entity) {
        if (entity == null) {
            return null;
        }
        return UserProfileResponse.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .name(entity.getName())
                .rollNumber(entity.getRollNumber())
                .department(entity.getDepartment())
                .semester(entity.getSemester())
                .section(entity.getSection())
                .build();
    }
}
