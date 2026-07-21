package com.kairo.backend.repository;

import com.kairo.backend.entity.AttendanceLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLogEntity, UUID> {

    List<AttendanceLogEntity> findAllByUserIdAndEnrollmentIdAndDeletedAtIsNullOrderByLogDateDescCreatedAtDesc(UUID userId, UUID enrollmentId);

    List<AttendanceLogEntity> findAllByUserIdAndLogDateAndDeletedAtIsNull(UUID userId, LocalDate logDate);

    Optional<AttendanceLogEntity> findByUserIdAndTimetableSlotIdAndLogDateAndDeletedAtIsNull(UUID userId, UUID timetableSlotId, LocalDate logDate);

    Optional<AttendanceLogEntity> findByIdAndUserIdAndDeletedAtIsNull(UUID id, UUID userId);
}
