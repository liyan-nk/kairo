package com.kairo.backend.repository;

import com.kairo.backend.entity.LostFoundItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LostFoundItemRepository extends JpaRepository<LostFoundItemEntity, UUID> {

    @Query("SELECT i FROM LostFoundItemEntity i WHERE i.deletedAt IS NULL ORDER BY i.itemDate DESC, i.created_at DESC")
    List<LostFoundItemEntity> findAllActiveItems();

    Optional<LostFoundItemEntity> findByIdAndDeletedAtIsNull(UUID id);
}
