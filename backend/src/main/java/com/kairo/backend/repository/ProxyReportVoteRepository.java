package com.kairo.backend.repository;

import com.kairo.backend.entity.ProxyReportVoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProxyReportVoteRepository extends JpaRepository<ProxyReportVoteEntity, UUID> {

    boolean existsByProxyReportIdAndVoterId(UUID proxyReportId, UUID voterId);
}
