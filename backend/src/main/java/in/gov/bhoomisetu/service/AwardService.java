package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.Award;
import in.gov.bhoomisetu.repository.AwardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AwardService {

    private final AwardRepository awardRepository;
    private final AuditService auditService;

    public AwardService(AwardRepository awardRepository, AuditService auditService) {
        this.awardRepository = awardRepository;
        this.auditService = auditService;
    }

    public List<Award> getAllAwards() {
        return awardRepository.findAll();
    }

    public List<Award> getAwardsByProject(Long projectId) {
        return awardRepository.findByProjectId(projectId);
    }

    public Award createAward(Award award, String username, String role) {
        if (award.getStatus() == null) award.setStatus("DRAFT");
        Award saved = awardRepository.save(award);
        auditService.logAction(username, role, "CREATE_AWARD", "STATUTORY_AWARDS", saved.getLacAwardNumber(), "NONE", saved.getStatus(), "Award drafted/declared", "127.0.0.1");
        return saved;
    }
}
