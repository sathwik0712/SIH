package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.entity.LandParcel;
import in.gov.bhoomisetu.service.LandParcelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
public class LandParcelController {

    private final LandParcelService landParcelService;

    public LandParcelController(LandParcelService landParcelService) {
        this.landParcelService = landParcelService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LandParcel>>> getAllParcels(
            @RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(ApiResponse.ok(landParcelService.getParcelsByProject(projectId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(landParcelService.getAllParcels()));
    }
}
