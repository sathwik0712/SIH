package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "affected_families")
public class AffectedFamily {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_parcel_id")
    private LandParcel landParcel;

    @Column(nullable = false)
    private String familyHeadName;

    @Column(nullable = false)
    private String category; // SC, ST, GENERAL, OTHER

    @Column(nullable = false)
    private String surveyNumber;

    @Column(nullable = false)
    private String landType; // Agricultural, Residential

    @Column(nullable = false)
    private String compensationStatus; // PENDING, ASSESSED, DISBURSED

    @Column(nullable = false)
    private String rrEntitlementStatus; // ELIGIBLE, INELIGIBLE, ALLOCATED, POSSESSION_HANDED_OVER

    public AffectedFamily() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public LandParcel getLandParcel() { return landParcel; }
    public void setLandParcel(LandParcel landParcel) { this.landParcel = landParcel; }
    public String getFamilyHeadName() { return familyHeadName; }
    public void setFamilyHeadName(String familyHeadName) { this.familyHeadName = familyHeadName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }
    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }
    public String getCompensationStatus() { return compensationStatus; }
    public void setCompensationStatus(String compensationStatus) { this.compensationStatus = compensationStatus; }
    public String getRrEntitlementStatus() { return rrEntitlementStatus; }
    public void setRrEntitlementStatus(String rrEntitlementStatus) { this.rrEntitlementStatus = rrEntitlementStatus; }
}
