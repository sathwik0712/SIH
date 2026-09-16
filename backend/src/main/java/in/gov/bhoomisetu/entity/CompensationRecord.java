package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "compensation_records")
public class CompensationRecord {

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
    private String landownerName;
    
    private String bankAccountNumber; // Masked on frontend
    private String ifscCode;

    @Column(nullable = false)
    private BigDecimal assessedAmount;

    private BigDecimal disbursedAmount;

    @Column(nullable = false)
    private String paymentStatus; // PENDING, PROCESSING, DISBURSED, FAILED

    private String pfmsBatchId;
    
    private LocalDate dbtDate;

    public CompensationRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public LandParcel getLandParcel() { return landParcel; }
    public void setLandParcel(LandParcel landParcel) { this.landParcel = landParcel; }
    public String getLandownerName() { return landownerName; }
    public void setLandownerName(String landownerName) { this.landownerName = landownerName; }
    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }
    public String getIfscCode() { return ifscCode; }
    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }
    public BigDecimal getAssessedAmount() { return assessedAmount; }
    public void setAssessedAmount(BigDecimal assessedAmount) { this.assessedAmount = assessedAmount; }
    public BigDecimal getDisbursedAmount() { return disbursedAmount; }
    public void setDisbursedAmount(BigDecimal disbursedAmount) { this.disbursedAmount = disbursedAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPfmsBatchId() { return pfmsBatchId; }
    public void setPfmsBatchId(String pfmsBatchId) { this.pfmsBatchId = pfmsBatchId; }
    public LocalDate getDbtDate() { return dbtDate; }
    public void setDbtDate(LocalDate dbtDate) { this.dbtDate = dbtDate; }
}
