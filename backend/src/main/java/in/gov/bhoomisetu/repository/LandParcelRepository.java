package in.gov.bhoomisetu.repository;

import in.gov.bhoomisetu.entity.LandParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandParcelRepository extends JpaRepository<LandParcel, Long>, JpaSpecificationExecutor<LandParcel> {
    Optional<LandParcel> findByParcelCode(String parcelCode);
    List<LandParcel> findByProjectId(Long projectId);
    List<LandParcel> findByDistrict(String district);
    List<LandParcel> findByVillage(String village);
    List<LandParcel> findByVerificationStatus(String verificationStatus);
    List<LandParcel> findByAcquisitionStatus(String acquisitionStatus);
    List<LandParcel> findByCompensationStatus(String compensationStatus);
}
