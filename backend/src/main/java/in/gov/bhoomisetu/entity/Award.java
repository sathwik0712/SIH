package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "awards")
public class Award {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String lacAwardNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_parcel_id")
    private LandParcel landParcel;

    @Column(nullable = false)
    private LocalDate awardDate;

    @Column(nullable = false)
    private BigDecimal solatiumMultiplier;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status; // DRAFT, DECLARED, CHALLENGED

    public Award() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLacAwardNumber() { return lacAwardNumber; }
    public void setLacAwardNumber(String lacAwardNumber) { this.lacAwardNumber = lacAwardNumber; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public LandParcel getLandParcel() { return landParcel; }
    public void setLandParcel(LandParcel landParcel) { this.landParcel = landParcel; }
    public LocalDate getAwardDate() { return awardDate; }
    public void setAwardDate(LocalDate awardDate) { this.awardDate = awardDate; }
    public BigDecimal getSolatiumMultiplier() { return solatiumMultiplier; }
    public void setSolatiumMultiplier(BigDecimal solatiumMultiplier) { this.solatiumMultiplier = solatiumMultiplier; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
