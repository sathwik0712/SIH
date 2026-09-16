package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.dto.ProjectDTOs.ProjectSummaryDTO;
import in.gov.bhoomisetu.entity.Project;
import in.gov.bhoomisetu.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    public ProjectService(ProjectRepository projectRepository, AuditService auditService) {
        this.projectRepository = projectRepository;
        this.auditService = auditService;
    }

    public List<ProjectSummaryDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + id));
    }

    public Project createProject(Project project, String username, String role) {
        if (project.getProjectCode() == null || project.getProjectCode().isEmpty()) {
            project.setProjectCode("PROJ-" + System.currentTimeMillis());
        }
        if (project.getAcquisitionStage() == null) project.setAcquisitionStage("PROPOSAL");
        if (project.getStatus() == null) project.setStatus("ON_TRACK");
        
        Project saved = projectRepository.save(project);
        auditService.logAction(username, role, "CREATE_PROJECT", "LAND_ACQUISITION", saved.getProjectCode(), "NONE", saved.getAcquisitionStage(), "New project proposal submitted", "127.0.0.1");
        return saved;
    }

    public ProjectSummaryDTO toSummaryDTO(Project p) {
        ProjectSummaryDTO dto = new ProjectSummaryDTO();
        dto.setId(p.getId());
        dto.setProjectCode(p.getProjectCode());
        dto.setProjectName(p.getProjectName());
        dto.setState(p.getState());
        dto.setDistrict(p.getDistrict());
        dto.setAcquiringAuthority(p.getAcquiringAuthority());
        dto.setAcquisitionStage(p.getAcquisitionStage());
        dto.setStatus(p.getStatus());
        dto.setTotalLandRequiredHectares(p.getTotalLandRequiredHectares());
        dto.setTotalLandAcquiredHectares(p.getTotalLandAcquiredHectares());
        dto.setTotalParcels(p.getTotalParcels());
        dto.setVerifiedParcels(p.getVerifiedParcels());
        dto.setTargetCompletionDate(p.getTargetCompletionDate());

        if (p.getTotalLandRequiredHectares() != null && p.getTotalLandRequiredHectares().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal acquired = p.getTotalLandAcquiredHectares() != null ? p.getTotalLandAcquiredHectares() : BigDecimal.ZERO;
            int pct = acquired.multiply(BigDecimal.valueOf(100))
                    .divide(p.getTotalLandRequiredHectares(), 0, RoundingMode.HALF_UP).intValue();
            dto.setProgressPercentage(Math.min(pct, 100));
        } else {
            dto.setProgressPercentage(0);
        }

        return dto;
    }
}
