package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.LandParcel;
import in.gov.bhoomisetu.repository.LandParcelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LandParcelService {

    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;

    public LandParcelService(LandParcelRepository landParcelRepository, AuditService auditService) {
        this.landParcelRepository = landParcelRepository;
        this.auditService = auditService;
    }

    public List<LandParcel> getAllParcels() {
        return landParcelRepository.findAll();
    }

    public List<LandParcel> getParcelsByProject(Long projectId) {
        return landParcelRepository.findByProjectId(projectId);
    }

    public LandParcel createParcel(LandParcel parcel, String username, String role) {
        if (parcel.getVerificationStatus() == null) parcel.setVerificationStatus("PENDING");
        if (parcel.getAcquisitionStatus() == null) parcel.setAcquisitionStatus("IDENTIFIED");
        if (parcel.getCompensationStatus() == null) parcel.setCompensationStatus("PENDING");
        LandParcel saved = landParcelRepository.save(parcel);
        auditService.logAction(username, role, "CREATE_PARCEL", "LAND_ACQUISITION", saved.getParcelCode(), "NONE", saved.getVerificationStatus(), "New land parcel added to system", "127.0.0.1");
        return saved;
    }

    public LandParcel updateParcel(Long id, LandParcel updated, String username, String role) {
        LandParcel existing = landParcelRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Parcel not found"));
        String oldStatus = existing.getVerificationStatus();
        
        // update fields
        existing.setAreaHectares(updated.getAreaHectares());
        existing.setOwnerName(updated.getOwnerName());
        existing.setVerificationStatus(updated.getVerificationStatus());
        existing.setAcquisitionStatus(updated.getAcquisitionStatus());
        existing.setCompensationStatus(updated.getCompensationStatus());
        existing.setFieldRemarks(updated.getFieldRemarks());
        
        LandParcel saved = landParcelRepository.save(existing);
        if (!oldStatus.equals(saved.getVerificationStatus())) {
             auditService.logAction(username, role, "UPDATE_PARCEL_STATUS", "LAND_ACQUISITION", saved.getParcelCode(), oldStatus, saved.getVerificationStatus(), "Parcel verification status updated", "127.0.0.1");
        }
        return saved;
    }
}
