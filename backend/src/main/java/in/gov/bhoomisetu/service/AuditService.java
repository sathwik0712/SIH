package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.AuditLog;
import in.gov.bhoomisetu.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog logAction(String username, String role, String action, String module,
                             String entityId, String previousStatus, String newStatus,
                             String details, String ipAddress) {
        AuditLog log = new AuditLog(username, role, action, module, entityId, previousStatus, newStatus, details, ipAddress);
        return auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByModule(String module) {
        return auditLogRepository.findByModuleOrderByTimestampDesc(module);
    }
}
