package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    Optional<Project> findByProjectCode(String projectCode);
    List<Project> findByState(String state);
    List<Project> findByDistrict(String district);
    List<Project> findByAcquiringAuthority(String acquiringAuthority);
    List<Project> findByStatus(String status);
    List<Project> findByAcquisitionStage(String acquisitionStage);
}
