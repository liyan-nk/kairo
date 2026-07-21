package com.kairo.backend.service;

import com.kairo.backend.dto.request.CreateProxyReportRequest;
import com.kairo.backend.dto.response.ProxyReportResponse;
import com.kairo.backend.entity.ConsensusStatusEnum;
import com.kairo.backend.entity.ProxyReportEntity;
import com.kairo.backend.entity.ProxyReportVoteEntity;
import com.kairo.backend.entity.TimetableSlotEntity;
import com.kairo.backend.exception.DuplicateResourceException;
import com.kairo.backend.exception.ResourceNotFoundException;
import com.kairo.backend.mapper.ProxyReportMapper;
import com.kairo.backend.repository.ProxyReportRepository;
import com.kairo.backend.repository.ProxyReportVoteRepository;
import com.kairo.backend.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ProxyReportService {

    private final ProxyReportRepository proxyReportRepository;
    private final ProxyReportVoteRepository proxyReportVoteRepository;
    private final TimetableSlotRepository timetableSlotRepository;

    @Value("${kairo.consensus.likely:3}")
    private int likelyThreshold;

    @Value("${kairo.consensus.verified:5}")
    private int verifiedThreshold;

    @Value("${kairo.consensus.auto-accepted:10}")
    private int autoAcceptedThreshold;

    public ProxyReportService(
            ProxyReportRepository proxyReportRepository,
            ProxyReportVoteRepository proxyReportVoteRepository,
            TimetableSlotRepository timetableSlotRepository
    ) {
        this.proxyReportRepository = proxyReportRepository;
        this.proxyReportVoteRepository = proxyReportVoteRepository;
        this.timetableSlotRepository = timetableSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<ProxyReportResponse> getActiveReports(LocalDate date) {
        List<ProxyReportEntity> activeReports = proxyReportRepository.findAllActiveReports(date);
        return activeReports.stream()
                .map(ProxyReportMapper::toResponse)
                .toList();
    }

    @Transactional
    public ProxyReportResponse submitReport(UUID reporterId, CreateProxyReportRequest request) {
        TimetableSlotEntity slot = timetableSlotRepository.findByIdAndDeletedAtIsNull(request.getTimetableSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Timetable slot not found: " + request.getTimetableSlotId()));

        String expectedSubject = slot.getSubjectName() != null ? slot.getSubjectName() :
                (slot.getEnrollment() != null && slot.getEnrollment().getCourse() != null ? slot.getEnrollment().getCourse().getName() : "");

        ProxyReportEntity report = proxyReportRepository.findByTimetableSlotIdAndReportDate(request.getTimetableSlotId(), request.getDate())
                .orElse(null);

        if (report == null) {
            report = ProxyReportEntity.builder()
                    .reporterId(reporterId)
                    .timetableSlotId(request.getTimetableSlotId())
                    .actualCourseId(slot.getEnrollment() != null ? slot.getEnrollment().getCourseId() : null)
                    .expectedSubject(expectedSubject)
                    .actualSubject(request.getActualSubject())
                    .room(request.getRoom() != null ? request.getRoom() : slot.getRoom())
                    .faculty(request.getFaculty() != null ? request.getFaculty() : slot.getFaculty())
                    .reportCount(1)
                    .status(ConsensusStatusEnum.PENDING)
                    .reportDate(request.getDate())
                    .build();

            ProxyReportEntity saved = proxyReportRepository.save(report);

            ProxyReportVoteEntity vote = ProxyReportVoteEntity.builder()
                    .proxyReportId(saved.getId())
                    .voterId(reporterId)
                    .build();
            proxyReportVoteRepository.save(vote);

            return ProxyReportMapper.toResponse(saved);
        } else {
            // Check duplicate vote
            if (proxyReportVoteRepository.existsByProxyReportIdAndVoterId(report.getId(), reporterId)) {
                throw new DuplicateResourceException("You have already voted on this report.");
            }

            return registerVote(reporterId, report);
        }
    }

    @Transactional
    public ProxyReportResponse confirmReport(UUID voterId, UUID reportId) {
        ProxyReportEntity report = proxyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Proxy report not found: " + reportId));

        if (proxyReportVoteRepository.existsByProxyReportIdAndVoterId(report.getId(), voterId)) {
            throw new DuplicateResourceException("You have already voted on this report.");
        }

        return registerVote(voterId, report);
    }

    private ProxyReportResponse registerVote(UUID voterId, ProxyReportEntity report) {
        report.setReportCount(report.getReportCount() + 1);
        report.setStatus(calculateConsensusStatus(report.getReportCount()));
        ProxyReportEntity saved = proxyReportRepository.save(report);

        ProxyReportVoteEntity vote = ProxyReportVoteEntity.builder()
                .proxyReportId(saved.getId())
                .voterId(voterId)
                .build();
        proxyReportVoteRepository.save(vote);

        return ProxyReportMapper.toResponse(saved);
    }

    private ConsensusStatusEnum calculateConsensusStatus(int count) {
        if (count >= autoAcceptedThreshold) {
            return ConsensusStatusEnum.AUTO_ACCEPTED;
        } else if (count >= verifiedThreshold) {
            return ConsensusStatusEnum.VERIFIED;
        } else if (count >= likelyThreshold) {
            return ConsensusStatusEnum.LIKELY;
        } else {
            return ConsensusStatusEnum.PENDING;
        }
    }
}
