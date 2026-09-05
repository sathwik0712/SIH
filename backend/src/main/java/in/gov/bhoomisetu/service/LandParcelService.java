package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.LandParcel;
import in.gov.bhoomisetu.repository.LandParcelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LandParcelService {

    private final LandParcelRepository landParcelRepository;

    public LandParcelService(LandParcelRepository landParcelRepository) {
        this.landParcelRepository = landParcelRepository;
    }

    public List<LandParcel> getAllParcels() {
        return landParcelRepository.findAll();
    }

    public List<LandParcel> getParcelsByProject(Long projectId) {
        return landParcelRepository.findByProjectId(projectId);
    }
}
