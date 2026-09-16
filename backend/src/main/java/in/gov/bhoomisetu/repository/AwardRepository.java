package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.Award;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AwardRepository extends JpaRepository<Award, Long> {
    List<Award> findByProjectId(Long projectId);
}
