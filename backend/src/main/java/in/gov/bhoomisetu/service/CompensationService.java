package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.CompensationRecord;
import in.gov.bhoomisetu.repository.CompensationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompensationService {

    private final CompensationRepository compensationRepository;
    private final AuditService auditService;

    public CompensationService(CompensationRepository compensationRepository, AuditService auditService) {
        this.compensationRepository = compensationRepository;
        this.auditService = auditService;
    }

    public List<CompensationRecord> getAllRecords() {
        return compensationRepository.findAll();
    }

    public List<CompensationRecord> getRecordsByProject(Long projectId) {
        return compensationRepository.findByProjectId(projectId);
    }

    public CompensationRecord createRecord(CompensationRecord record, String username, String role) {
        if (record.getPaymentStatus() == null) record.setPaymentStatus("PENDING");
        CompensationRecord saved = compensationRepository.save(record);
        auditService.logAction(username, role, "ASSESS_COMPENSATION", "PFMS_DISBURSAL", String.valueOf(saved.getId()), "NONE", saved.getPaymentStatus(), "Assessed compensation for " + saved.getLandownerName(), "127.0.0.1");
        return saved;
    }
    
    public CompensationRecord updateStatus(Long id, String status, String username, String role) {
        CompensationRecord existing = compensationRepository.findById(id).orElseThrow();
        String oldStatus = existing.getPaymentStatus();
        existing.setPaymentStatus(status);
        CompensationRecord saved = compensationRepository.save(existing);
        auditService.logAction(username, role, "UPDATE_COMPENSATION", "PFMS_DISBURSAL", String.valueOf(saved.getId()), oldStatus, saved.getPaymentStatus(), "Updated compensation status for " + saved.getLandownerName(), "127.0.0.1");
        return saved;
    }
}
