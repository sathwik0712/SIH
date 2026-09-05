package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String projectCode; // e.g. "NH65-HYD-PUN-01"

    @Column(nullable = false)
    private String projectName;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String acquiringAuthority; // e.g. "NHAI", "DFCCIL", "SECI", "NICDC"

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String acquisitionStage; // PROPOSAL, VERIFICATION, NOTIFICATION, OBJECTION, AWARD, COMPENSATION, RANDR, POSSESSION, COMPLETED

    @Column(nullable = false)
    private String status; // ON_TRACK, AT_RISK, DELAYED, COMPLETED

    private BigDecimal totalLandRequiredHectares;
    private BigDecimal totalLandAcquiredHectares;
    private Integer totalParcels;
    private Integer verifiedParcels;
    private Integer totalAffectedFamilies;
    private Integer rehabilitatedFamilies;

    private BigDecimal compensationAssessedCr;
    private BigDecimal compensationDisbursedCr;

    private LocalDate notificationDate;
    private LocalDate targetCompletionDate;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Project() {}

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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAcquisitionStage() { return acquisitionStage; }
    public void setAcquisitionStage(String acquisitionStage) { this.acquisitionStage = acquisitionStage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalLandRequiredHectares() { return totalLandRequiredHectares; }
    public void setTotalLandRequiredHectares(BigDecimal totalLandRequiredHectares) { this.totalLandRequiredHectares = totalLandRequiredHectares; }

    public BigDecimal getTotalLandAcquiredHectares() { return totalLandAcquiredHectares; }
    public void setTotalLandAcquiredHectares(BigDecimal totalLandAcquiredHectares) { this.totalLandAcquiredHectares = totalLandAcquiredHectares; }

    public Integer getTotalParcels() { return totalParcels; }
    public void setTotalParcels(Integer totalParcels) { this.totalParcels = totalParcels; }

    public Integer getVerifiedParcels() { return verifiedParcels; }
    public void setVerifiedParcels(Integer verifiedParcels) { this.verifiedParcels = verifiedParcels; }

    public Integer getTotalAffectedFamilies() { return totalAffectedFamilies; }
    public void setTotalAffectedFamilies(Integer totalAffectedFamilies) { this.totalAffectedFamilies = totalAffectedFamilies; }

    public Integer getRehabilitatedFamilies() { return rehabilitatedFamilies; }
    public void setRehabilitatedFamilies(Integer rehabilitatedFamilies) { this.rehabilitatedFamilies = rehabilitatedFamilies; }

    public BigDecimal getCompensationAssessedCr() { return compensationAssessedCr; }
    public void setCompensationAssessedCr(BigDecimal compensationAssessedCr) { this.compensationAssessedCr = compensationAssessedCr; }

    public BigDecimal getCompensationDisbursedCr() { return compensationDisbursedCr; }
    public void setCompensationDisbursedCr(BigDecimal compensationDisbursedCr) { this.compensationDisbursedCr = compensationDisbursedCr; }

    public LocalDate getNotificationDate() { return notificationDate; }
    public void setNotificationDate(LocalDate notificationDate) { this.notificationDate = notificationDate; }

    public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
