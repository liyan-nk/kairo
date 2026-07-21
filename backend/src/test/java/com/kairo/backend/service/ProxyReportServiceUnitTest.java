package com.kairo.backend.service;

import com.kairo.backend.dto.request.CreateProxyReportRequest;
import com.kairo.backend.dto.response.ProxyReportResponse;
import com.kairo.backend.entity.ConsensusStatusEnum;
import com.kairo.backend.entity.ProxyReportEntity;
import com.kairo.backend.entity.ProxyReportVoteEntity;
import com.kairo.backend.entity.TimetableSlotEntity;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.repository.ProxyReportRepository;
import com.kairo.backend.repository.ProxyReportVoteRepository;
import com.kairo.backend.repository.TimetableSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProxyReportServiceUnitTest {

    @Mock
    private ProxyReportRepository proxyReportRepository;

    @Mock
    private ProxyReportVoteRepository proxyReportVoteRepository;

    @Mock
    private TimetableSlotRepository timetableSlotRepository;

    private ProxyReportService proxyReportService;

    private final UUID userId = UUID.randomUUID();
    private final UUID slotId = UUID.randomUUID();
    private final UUID reportId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        proxyReportService = new ProxyReportService(
                proxyReportRepository,
                proxyReportVoteRepository,
                timetableSlotRepository
        );

        // Configure thresholds dynamically (representing configurable values)
        ReflectionTestUtils.setField(proxyReportService, "likelyThreshold", 3);
        ReflectionTestUtils.setField(proxyReportService, "verifiedThreshold", 5);
        ReflectionTestUtils.setField(proxyReportService, "autoAcceptedThreshold", 10);
    }

    @Test
    @DisplayName("submitReport should create a new proxy report when one does not exist for the slot and date")
    void submitReport_NewReport_Success() {
        TimetableSlotEntity slot = TimetableSlotEntity.builder()
                .id(slotId)
                .subjectName("Operating Systems")
                .room("102")
                .faculty("Prof. Verma")
                .build();

        CreateProxyReportRequest request = CreateProxyReportRequest.builder()
                .timetableSlotId(slotId)
                .actualSubject("Database Systems")
                .room("105")
                .faculty("Dr. Sharma")
                .date(LocalDate.now())
                .build();

        ProxyReportEntity savedReport = ProxyReportEntity.builder()
                .id(reportId)
                .timetableSlotId(slotId)
                .expectedSubject("Operating Systems")
                .actualSubject("Database Systems")
                .room("105")
                .faculty("Dr. Sharma")
                .reportCount(1)
                .status(ConsensusStatusEnum.PENDING)
                .reportDate(request.getDate())
                .build();

        when(timetableSlotRepository.findByIdAndDeletedAtIsNull(slotId)).thenReturn(Optional.of(slot));
        when(proxyReportRepository.findByTimetableSlotIdAndReportDate(slotId, request.getDate())).thenReturn(Optional.empty());
        when(proxyReportRepository.save(any(ProxyReportEntity.class))).thenReturn(savedReport);

        ProxyReportResponse response = proxyReportService.submitReport(userId, request);

        assertNotNull(response);
        assertEquals("Database Systems", response.getActualSubject());
        assertEquals("Pending", response.getStatus());
        assertEquals(1, response.getReportCount());

        verify(proxyReportVoteRepository).save(any(ProxyReportVoteEntity.class));
    }

    @Test
    @DisplayName("submitReport should upvote and update consensus tier to LIKELY when threshold met")
    void submitReport_ExistingReport_UpvoteToLikely() {
        TimetableSlotEntity slot = TimetableSlotEntity.builder()
                .id(slotId)
                .subjectName("Operating Systems")
                .build();

        CreateProxyReportRequest request = CreateProxyReportRequest.builder()
                .timetableSlotId(slotId)
                .actualSubject("Database Systems")
                .date(LocalDate.now())
                .build();

        ProxyReportEntity existingReport = ProxyReportEntity.builder()
                .id(reportId)
                .timetableSlotId(slotId)
                .reportCount(2) // Going to be 3 (LIKELY threshold)
                .status(ConsensusStatusEnum.PENDING)
                .reportDate(request.getDate())
                .build();

        when(timetableSlotRepository.findByIdAndDeletedAtIsNull(slotId)).thenReturn(Optional.of(slot));
        when(proxyReportRepository.findByTimetableSlotIdAndReportDate(slotId, request.getDate())).thenReturn(Optional.of(existingReport));
        when(proxyReportVoteRepository.existsByProxyReportIdAndVoterId(reportId, userId)).thenReturn(false);
        when(proxyReportRepository.save(existingReport)).thenReturn(existingReport);

        ProxyReportResponse response = proxyReportService.submitReport(userId, request);

        assertNotNull(response);
        assertEquals(3, response.getReportCount());
        assertEquals("Likely", response.getStatus());
        verify(proxyReportVoteRepository).save(any(ProxyReportVoteEntity.class));
    }

    @Test
    @DisplayName("submitReport should throw DuplicateResourceException if user already voted")
    void submitReport_ExistingReport_Voted_ThrowsConflict() {
        TimetableSlotEntity slot = TimetableSlotEntity.builder()
                .id(slotId)
                .subjectName("Operating Systems")
                .build();

        CreateProxyReportRequest request = CreateProxyReportRequest.builder()
                .timetableSlotId(slotId)
                .actualSubject("Database Systems")
                .date(LocalDate.now())
                .build();

        ProxyReportEntity existingReport = ProxyReportEntity.builder()
                .id(reportId)
                .timetableSlotId(slotId)
                .reportCount(1)
                .status(ConsensusStatusEnum.PENDING)
                .build();

        when(timetableSlotRepository.findByIdAndDeletedAtIsNull(slotId)).thenReturn(Optional.of(slot));
        when(proxyReportRepository.findByTimetableSlotIdAndReportDate(slotId, request.getDate())).thenReturn(Optional.of(existingReport));
        when(proxyReportVoteRepository.existsByProxyReportIdAndVoterId(reportId, userId)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> proxyReportService.submitReport(userId, request));
        verify(proxyReportRepository, never()).save(any());
    }
}
