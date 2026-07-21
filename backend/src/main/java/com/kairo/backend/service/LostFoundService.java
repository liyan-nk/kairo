package com.kairo.backend.service;

import com.kairo.backend.dto.request.CreateLostFoundRequest;
import com.kairo.backend.dto.response.ClaimResponse;
import com.kairo.backend.dto.response.LostFoundResponse;
import com.kairo.backend.entity.LostFoundItemEntity;
import com.kairo.backend.entity.LostFoundStatusEnum;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.InvalidOperationException;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.mapper.LostFoundMapper;
import com.kairo.backend.repository.LostFoundItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class LostFoundService {

    private final LostFoundItemRepository lostFoundItemRepository;

    public LostFoundService(LostFoundItemRepository lostFoundItemRepository) {
        this.lostFoundItemRepository = lostFoundItemRepository;
    }

    @Transactional(readOnly = true)
    public List<LostFoundResponse> getActiveItems() {
        List<LostFoundItemEntity> items = lostFoundItemRepository.findAllActiveItems();
        return items.stream()
                .map(LostFoundMapper::toResponse)
                .toList();
    }

    @Transactional
    public LostFoundResponse submitItem(UUID reporterId, CreateLostFoundRequest request) {
        String answerHash = hashAnswer(request.getAnswer());

        LostFoundItemEntity item = LostFoundItemEntity.builder()
                .reporterId(reporterId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation())
                .itemDate(request.getDate())
                .status(LostFoundStatusEnum.LOST)
                .validationQuestion(request.getQuestion())
                .validationAnswerHash(answerHash)
                .contactInfo(request.getContactInfo())
                .build();

        LostFoundItemEntity saved = lostFoundItemRepository.save(item);
        return LostFoundMapper.toResponse(saved);
    }

    @Transactional
    public ClaimResponse claimItem(UUID claimerId, UUID itemId, String rawAnswer) {
        LostFoundItemEntity item = lostFoundItemRepository.findByIdAndDeletedAtIsNull(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Lost & found item not found: " + itemId));

        if (item.getStatus() == LostFoundStatusEnum.CLAIMED) {
            throw new DuplicateResourceException("This item has already been claimed.");
        }

        String inputHash = hashAnswer(rawAnswer);
        if (!inputHash.equals(item.getValidationAnswerHash())) {
            throw new InvalidOperationException("Incorrect validation answer");
        }

        item.setStatus(LostFoundStatusEnum.CLAIMED);
        item.setClaimedById(claimerId);
        item.setClaimedAt(Instant.now());
        lostFoundItemRepository.save(item);

        return new ClaimResponse(item.getId(), LostFoundStatusEnum.CLAIMED.getDisplayName());
    }

    private String hashAnswer(String answer) {
        if (answer == null) return "";
        String normalized = answer.trim().toLowerCase();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("SHA-256 hashing failed", ex);
        }
    }
}
