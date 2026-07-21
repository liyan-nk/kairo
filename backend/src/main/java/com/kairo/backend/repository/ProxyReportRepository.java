package com.kairo.backend.repository;

import com.kairo.backend.entity.ProxyReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProxyReportRepository extends JpaRepository<ProxyReportEntity, UUID> {

    @Query("SELECT r FROM ProxyReportEntity r WHERE r.reportDate >= :date ORDER BY r.reportDate ASC, r.created_at DESC")
    List<ProxyReportEntity> findAllActiveReports(@Param("date") LocalDate date);

    Optional<ProxyReportEntity> findByTimetableSlotIdAndReportDate(UUID timetableSlotId, LocalDate reportDate);

    Optional<ProxyReportEntity> findByIdAndReportDateGreaterThanEqual(UUID id, LocalDate date);
}
