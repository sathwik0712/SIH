package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.entity.Award;
import in.gov.bhoomisetu.service.AwardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/awards")
public class AwardController {

    private final AwardService awardService;

    public AwardController(AwardService awardService) {
        this.awardService = awardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Award>>> getAllAwards(
            @RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(ApiResponse.ok(awardService.getAwardsByProject(projectId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(awardService.getAllAwards()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Award>> createAward(@RequestBody Award award) {
        return ResponseEntity.ok(ApiResponse.ok(awardService.createAward(award, "API_USER", "SYSTEM")));
    }
}
