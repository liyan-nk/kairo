package com.kairo.backend.repository;

import com.kairo.backend.entity.DayOfWeekEnum;
import com.kairo.backend.entity.TimetableSlotEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlotEntity, UUID> {

    @Query("SELECT s FROM TimetableSlotEntity s LEFT JOIN FETCH s.enrollment e LEFT JOIN FETCH e.course c WHERE e.userId = :userId AND s.deletedAt IS NULL ORDER BY s.startTime ASC")
    List<TimetableSlotEntity> findAllByUserId(@Param("userId") UUID userId);

    @Query("SELECT s FROM TimetableSlotEntity s LEFT JOIN FETCH s.enrollment e LEFT JOIN FETCH e.course c WHERE e.userId = :userId AND s.dayOfWeek = :dayOfWeek AND s.deletedAt IS NULL ORDER BY s.startTime ASC")
    List<TimetableSlotEntity> findAllByUserIdAndDayOfWeek(@Param("userId") UUID userId, @Param("dayOfWeek") DayOfWeekEnum dayOfWeek);

    Optional<TimetableSlotEntity> findByIdAndDeletedAtIsNull(UUID id);
}
