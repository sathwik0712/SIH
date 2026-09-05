package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "land_parcels")
public class LandParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String parcelCode; // e.g. "LP-PUN-001"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private String surveyNumber;

    private String khasraNumber;

    @Column(nullable = false)
    private String village;

    @Column(nullable = false)
    private String mandalOrTehsil;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private BigDecimal areaHectares;

    @Column(nullable = false)
    private String landType; // Agricultural, Commercial, Residential, Forest, Barren

    @Column(nullable = false)
    private String ownershipType; // Private, Government, Community, Trust

    @Column(nullable = false)
    private String ownerName;

    private String ownerContact;

    @Column(nullable = false)
    private String verificationStatus; // PENDING, VERIFIED, REJECTED, FIELD_VISIT_SCHEDULED

    @Column(nullable = false)
    private String acquisitionStatus; // IDENTIFIED, NOTIFIED, OBJECTION_RAISED, AWARD_DECLARED, COMPENSATION_PAID, POSSESSION_TAKEN

    @Column(nullable = false)
    private String compensationStatus; // PENDING, ASSESSED, APPROVED, DISBURSED, DISPUTED

    private BigDecimal compensationAmountInr;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String boundaryCoordinatesJson; // GeoJSON polygon or coordinate array for GIS Leaflet

    @Column(length = 1000)
    private String fieldRemarks;

    private String verifiedBy;
    private LocalDateTime verifiedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public LandParcel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getParcelCode() { return parcelCode; }
    public void setParcelCode(String parcelCode) { this.parcelCode = parcelCode; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public String getKhasraNumber() { return khasraNumber; }
    public void setKhasraNumber(String khasraNumber) { this.khasraNumber = khasraNumber; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getMandalOrTehsil() { return mandalOrTehsil; }
    public void setMandalOrTehsil(String mandalOrTehsil) { this.mandalOrTehsil = mandalOrTehsil; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public BigDecimal getAreaHectares() { return areaHectares; }
    public void setAreaHectares(BigDecimal areaHectares) { this.areaHectares = areaHectares; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getOwnershipType() { return ownershipType; }
    public void setOwnershipType(String ownershipType) { this.ownershipType = ownershipType; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerContact() { return ownerContact; }
    public void setOwnerContact(String ownerContact) { this.ownerContact = ownerContact; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getAcquisitionStatus() { return acquisitionStatus; }
    public void setAcquisitionStatus(String acquisitionStatus) { this.acquisitionStatus = acquisitionStatus; }

    public String getCompensationStatus() { return compensationStatus; }
    public void setCompensationStatus(String compensationStatus) { this.compensationStatus = compensationStatus; }

    public BigDecimal getCompensationAmountInr() { return compensationAmountInr; }
    public void setCompensationAmountInr(BigDecimal compensationAmountInr) { this.compensationAmountInr = compensationAmountInr; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getBoundaryCoordinatesJson() { return boundaryCoordinatesJson; }
    public void setBoundaryCoordinatesJson(String boundaryCoordinatesJson) { this.boundaryCoordinatesJson = boundaryCoordinatesJson; }

    public String getFieldRemarks() { return fieldRemarks; }
    public void setFieldRemarks(String fieldRemarks) { this.fieldRemarks = fieldRemarks; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
