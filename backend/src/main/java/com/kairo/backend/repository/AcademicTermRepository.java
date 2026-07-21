package com.kairo.backend.repository;

import com.kairo.backend.entity.AcademicTermEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AcademicTermRepository extends JpaRepository<AcademicTermEntity, UUID> {

    Optional<AcademicTermEntity> findByIsActiveTrueAndDeletedAtIsNull();
}
