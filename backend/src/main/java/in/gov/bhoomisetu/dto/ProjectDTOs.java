package in.gov.bhoomisetu.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectDTOs {

    public static class ProjectSummaryDTO {
        private Long id;
        private String projectCode;
        private String projectName;
        private String state;
        private String district;
        private String acquiringAuthority;
        private String acquisitionStage;
        private String status;
        private BigDecimal totalLandRequiredHectares;
        private BigDecimal totalLandAcquiredHectares;
        private Integer progressPercentage;
        private Integer totalParcels;
        private Integer verifiedParcels;
        private LocalDate targetCompletionDate;

        public ProjectSummaryDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getProjectCode() { return projectCode; }
        public void setProjectCode(String projectCode) { this.projectCode = projectCode; }

        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getAcquiringAuthority() { return acquiringAuthority; }
        public void setAcquiringAuthority(String acquiringAuthority) { this.acquiringAuthority = acquiringAuthority; }

        public String getAcquisitionStage() { return acquisitionStage; }
        public void setAcquisitionStage(String acquisitionStage) { this.acquisitionStage = acquisitionStage; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public BigDecimal getTotalLandRequiredHectares() { return totalLandRequiredHectares; }
        public void setTotalLandRequiredHectares(BigDecimal totalLandRequiredHectares) { this.totalLandRequiredHectares = totalLandRequiredHectares; }

        public BigDecimal getTotalLandAcquiredHectares() { return totalLandAcquiredHectares; }
        public void setTotalLandAcquiredHectares(BigDecimal totalLandAcquiredHectares) { this.totalLandAcquiredHectares = totalLandAcquiredHectares; }

        public Integer getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

        public Integer getTotalParcels() { return totalParcels; }
        public void setTotalParcels(Integer totalParcels) { this.totalParcels = totalParcels; }

        public Integer getVerifiedParcels() { return verifiedParcels; }
        public void setVerifiedParcels(Integer verifiedParcels) { this.verifiedParcels = verifiedParcels; }

        public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
        public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }
    }
}
