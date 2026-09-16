package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.AffectedFamily;
import in.gov.bhoomisetu.repository.AffectedFamilyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AffectedFamilyService {

    private final AffectedFamilyRepository affectedFamilyRepository;
    private final AuditService auditService;

    public AffectedFamilyService(AffectedFamilyRepository affectedFamilyRepository, AuditService auditService) {
        this.affectedFamilyRepository = affectedFamilyRepository;
        this.auditService = auditService;
    }

    public List<AffectedFamily> getAllFamilies() {
        return affectedFamilyRepository.findAll();
    }

    public List<AffectedFamily> getFamiliesByProject(Long projectId) {
        return affectedFamilyRepository.findByProjectId(projectId);
    }

    public AffectedFamily createFamily(AffectedFamily family, String username, String role) {
        if (family.getCompensationStatus() == null) family.setCompensationStatus("PENDING");
        if (family.getRrEntitlementStatus() == null) family.setRrEntitlementStatus("ELIGIBLE");
        AffectedFamily saved = affectedFamilyRepository.save(family);
        auditService.logAction(username, role, "ADD_AFFECTED_FAMILY", "REHABILITATION", String.valueOf(saved.getId()), "NONE", saved.getRrEntitlementStatus(), "Registered affected family: " + saved.getFamilyHeadName(), "127.0.0.1");
        return saved;
    }
}
