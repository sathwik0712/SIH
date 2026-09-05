package in.gov.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, VERIFY, APPROVE, DISBURSE, REJECT

    @Column(nullable = false)
    private String module; // AUTH, PROJECTS, LAND_PARCELS, VERIFICATION, NOTIFICATIONS, AWARDS, COMPENSATION, RANDR, POSSESSION, ADMIN

    private String entityId;
    private String previousStatus;
    private String newStatus;

    @Column(length = 1500)
    private String details;

    private String ipAddress;

    public AuditLog() {}

    public AuditLog(String username, String role, String action, String module, String entityId,
                    String previousStatus, String newStatus, String details, String ipAddress) {
        this.timestamp = LocalDateTime.now();
        this.username = username;
        this.role = role;
        this.action = action;
        this.module = module;
        this.entityId = entityId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.details = details;
        this.ipAddress = ipAddress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
