package com.kairo.backend.repository;

import com.kairo.backend.entity.OfficialBaselineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfficialBaselineRepository extends JpaRepository<OfficialBaselineEntity, UUID> {

    Optional<OfficialBaselineEntity> findTopByEnrollmentIdOrderByPublishedDateDesc(UUID enrollmentId);

    java.util.List<OfficialBaselineEntity> findAllByEnrollmentIdIn(java.util.List<UUID> enrollmentIds);
}
