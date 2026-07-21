package com.kairo.backend.service;

import com.kairo.backend.dto.request.UpdateProfileRequest;
import com.kairo.backend.dto.response.UserProfileResponse;
import com.kairo.backend.entity.UserEntity;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.mapper.UserMapper;
import com.kairo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public ProfileService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return userMapper.toUserProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setName(request.getName());
        if (request.getRollNumber() != null) user.setRollNumber(request.getRollNumber());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getSemester() != null) user.setSemester(request.getSemester());
        if (request.getSection() != null) user.setSection(request.getSection());

        UserEntity updatedUser = userRepository.save(user);
        return userMapper.toUserProfileResponse(updatedUser);
    }
}
