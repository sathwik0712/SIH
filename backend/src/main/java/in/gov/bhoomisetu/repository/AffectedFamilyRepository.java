package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.AffectedFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectedFamilyRepository extends JpaRepository<AffectedFamily, Long> {
    List<AffectedFamily> findByProjectId(Long projectId);
}
