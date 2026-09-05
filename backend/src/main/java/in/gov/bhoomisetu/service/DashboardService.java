package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.Project;
import in.gov.bhoomisetu.repository.LandParcelRepository;
import in.gov.bhoomisetu.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;

    public DashboardService(ProjectRepository projectRepository, LandParcelRepository landParcelRepository) {
        this.projectRepository = projectRepository;
        this.landParcelRepository = landParcelRepository;
    }

    public Map<String, Object> getDashboardStats(String state, String district) {
        List<Project> projects = projectRepository.findAll();

        if (state != null && !state.isBlank() && !state.equalsIgnoreCase("ALL")) {
            projects = projects.stream().filter(p -> p.getState().equalsIgnoreCase(state)).toList();
        }
        if (district != null && !district.isBlank() && !district.equalsIgnoreCase("ALL")) {
            projects = projects.stream().filter(p -> p.getDistrict().equalsIgnoreCase(district)).toList();
        }

        int totalProjects = projects.size();
        BigDecimal totalLandRequired = projects.stream()
                .map(p -> p.getTotalLandRequiredHectares() != null ? p.getTotalLandRequiredHectares() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLandAcquired = projects.stream()
                .map(p -> p.getTotalLandAcquiredHectares() != null ? p.getTotalLandAcquiredHectares() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalParcels = projects.stream().mapToInt(p -> p.getTotalParcels() != null ? p.getTotalParcels() : 0).sum();
        int verifiedParcels = projects.stream().mapToInt(p -> p.getVerifiedParcels() != null ? p.getVerifiedParcels() : 0).sum();
        int pendingVerification = Math.max(0, totalParcels - verifiedParcels);

        BigDecimal compensationAssessed = projects.stream()
                .map(p -> p.getCompensationAssessedCr() != null ? p.getCompensationAssessedCr() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal compensationDisbursed = projects.stream()
                .map(p -> p.getCompensationDisbursedCr() != null ? p.getCompensationDisbursedCr() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int affectedFamilies = projects.stream().mapToInt(p -> p.getTotalAffectedFamilies() != null ? p.getTotalAffectedFamilies() : 0).sum();
        int rehabilitatedFamilies = projects.stream().mapToInt(p -> p.getRehabilitatedFamilies() != null ? p.getRehabilitatedFamilies() : 0).sum();

        long delayedCases = projects.stream().filter(p -> "DELAYED".equalsIgnoreCase(p.getStatus())).count();
        long atRiskCases = projects.stream().filter(p -> "AT_RISK".equalsIgnoreCase(p.getStatus())).count();
        long onTrackCases = projects.stream().filter(p -> "ON_TRACK".equalsIgnoreCase(p.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", totalProjects);
        stats.put("totalLandRequiredHectares", totalLandRequired);
        stats.put("totalLandAcquiredHectares", totalLandAcquired);
        stats.put("totalParcels", totalParcels);
        stats.put("verifiedParcels", verifiedParcels);
        stats.put("parcelsPendingVerification", pendingVerification);
        stats.put("compensationAssessedCr", compensationAssessed);
        stats.put("compensationDisbursedCr", compensationDisbursed);
        stats.put("totalAffectedFamilies", affectedFamilies);
        stats.put("rehabilitatedFamilies", rehabilitatedFamilies);
        stats.put("possessionCompletedHectares", totalLandAcquired.multiply(new BigDecimal("0.85")));
        stats.put("delayedCases", delayedCases);
        stats.put("atRiskCases", atRiskCases);
        stats.put("onTrackCases", onTrackCases);

        return stats;
    }
}
