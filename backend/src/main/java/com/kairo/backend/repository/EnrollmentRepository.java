package com.kairo.backend.repository;

import com.kairo.backend.entity.EnrollmentEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, UUID> {

    @EntityGraph(attributePaths = {"course"})
    List<EnrollmentEntity> findByUserIdAndDeletedAtIsNull(UUID userId);

    @EntityGraph(attributePaths = {"course"})
    Optional<EnrollmentEntity> findByUserIdAndCourseIdAndDeletedAtIsNull(UUID userId, UUID courseId);

    @EntityGraph(attributePaths = {"course"})
    Optional<EnrollmentEntity> findByIdAndDeletedAtIsNull(UUID id);
}
