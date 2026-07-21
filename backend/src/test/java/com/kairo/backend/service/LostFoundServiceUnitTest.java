package com.kairo.backend.service;

import com.kairo.backend.dto.request.CreateLostFoundRequest;
import com.kairo.backend.dto.response.ClaimResponse;
import com.kairo.backend.dto.response.LostFoundResponse;
import com.kairo.backend.entity.LostFoundItemEntity;
import com.kairo.backend.entity.LostFoundStatusEnum;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.InvalidOperationException;
import com.kairo.backend.repository.LostFoundItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LostFoundServiceUnitTest {

    @Mock
    private LostFoundItemRepository lostFoundItemRepository;

    private LostFoundService lostFoundService;

    private final UUID userId = UUID.randomUUID();
    private final UUID itemId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        lostFoundService = new LostFoundService(lostFoundItemRepository);
    }

    @Test
    @DisplayName("submitItem should hash validation answer and save item as Lost status")
    void submitItem_Success() {
        CreateLostFoundRequest request = CreateLostFoundRequest.builder()
                .title("Scientific Calculator")
                .description("fx-991ex")
                .category("Electronics")
                .location("Room 304")
                .date(LocalDate.now())
                .question("What color is the back cover?")
                .answer("   Blue   ") // has whitespace & uppercase
                .contactInfo("Prof. Verma")
                .build();

        LostFoundItemEntity savedItem = LostFoundItemEntity.builder()
                .id(itemId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation())
                .itemDate(request.getDate())
                .status(LostFoundStatusEnum.LOST)
                .validationQuestion(request.getQuestion())
                // SHA-256 of "blue"
                .validationAnswerHash("16477688c0e00699c6cfa4497a3612d7e83c532062b64b250fed8908128ed548")
                .contactInfo(request.getContactInfo())
                .build();

        when(lostFoundItemRepository.save(any(LostFoundItemEntity.class))).thenReturn(savedItem);

        LostFoundResponse response = lostFoundService.submitItem(userId, request);

        assertNotNull(response);
        assertEquals("Scientific Calculator", response.getTitle());
        assertEquals("Lost", response.getStatus());
        verify(lostFoundItemRepository).save(any(LostFoundItemEntity.class));
    }

    @Test
    @DisplayName("claimItem should mark item as Claimed when answer matches (case & whitespace insensitive)")
    void claimItem_CorrectAnswer_Success() {
        LostFoundItemEntity item = LostFoundItemEntity.builder()
                .id(itemId)
                .status(LostFoundStatusEnum.LOST)
                // SHA-256 of "blue"
                .validationAnswerHash("16477688c0e00699c6cfa4497a3612d7e83c532062b64b250fed8908128ed548")
                .build();

        when(lostFoundItemRepository.findByIdAndDeletedAtIsNull(itemId)).thenReturn(Optional.of(item));

        ClaimResponse response = lostFoundService.claimItem(userId, itemId, "   BLUE  ");

        assertNotNull(response);
        assertEquals("Claimed", response.getStatus());
        assertEquals(LostFoundStatusEnum.CLAIMED, item.getStatus());
        assertEquals(userId, item.getClaimedById());
        assertNotNull(item.getClaimedAt());
        verify(lostFoundItemRepository).save(item);
    }

    @Test
    @DisplayName("claimItem should throw InvalidOperationException when answer is incorrect")
    void claimItem_IncorrectAnswer_ThrowsException() {
        LostFoundItemEntity item = LostFoundItemEntity.builder()
                .id(itemId)
                .status(LostFoundStatusEnum.LOST)
                .validationAnswerHash("c157a79031e1c40f85931829bc5fc552d436a6cb94c16f2c3d52c7a0d4c148f0")
                .build();

        when(lostFoundItemRepository.findByIdAndDeletedAtIsNull(itemId)).thenReturn(Optional.of(item));

        assertThrows(InvalidOperationException.class, () -> lostFoundService.claimItem(userId, itemId, "Green"));
        verify(lostFoundItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("claimItem should throw DuplicateResourceException when item is already claimed")
    void claimItem_AlreadyClaimed_ThrowsException() {
        LostFoundItemEntity item = LostFoundItemEntity.builder()
                .id(itemId)
                .status(LostFoundStatusEnum.CLAIMED)
                .build();

        when(lostFoundItemRepository.findByIdAndDeletedAtIsNull(itemId)).thenReturn(Optional.of(item));

        assertThrows(DuplicateResourceException.class, () -> lostFoundService.claimItem(userId, itemId, "Blue"));
    }
}
