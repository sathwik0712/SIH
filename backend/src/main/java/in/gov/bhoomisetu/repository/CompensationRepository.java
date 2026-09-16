package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.CompensationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompensationRepository extends JpaRepository<CompensationRecord, Long> {
    List<CompensationRecord> findByProjectId(Long projectId);
}
