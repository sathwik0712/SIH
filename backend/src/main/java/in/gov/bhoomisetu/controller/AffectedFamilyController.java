package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.entity.AffectedFamily;
import in.gov.bhoomisetu.service.AffectedFamilyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affected-families")
public class AffectedFamilyController {

    private final AffectedFamilyService affectedFamilyService;

    public AffectedFamilyController(AffectedFamilyService affectedFamilyService) {
        this.affectedFamilyService = affectedFamilyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AffectedFamily>>> getAllFamilies(
            @RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(ApiResponse.ok(affectedFamilyService.getFamiliesByProject(projectId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(affectedFamilyService.getAllFamilies()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AffectedFamily>> createFamily(@RequestBody AffectedFamily family) {
        return ResponseEntity.ok(ApiResponse.ok(affectedFamilyService.createFamily(family, "API_USER", "SYSTEM")));
    }
}
