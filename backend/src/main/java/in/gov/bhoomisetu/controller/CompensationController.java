package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.entity.CompensationRecord;
import in.gov.bhoomisetu.service.CompensationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compensation")
public class CompensationController {

    private final CompensationService compensationService;

    public CompensationController(CompensationService compensationService) {
        this.compensationService = compensationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompensationRecord>>> getAllRecords(
            @RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ResponseEntity.ok(ApiResponse.ok(compensationService.getRecordsByProject(projectId)));
        }
        return ResponseEntity.ok(ApiResponse.ok(compensationService.getAllRecords()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CompensationRecord>> createRecord(@RequestBody CompensationRecord record) {
        return ResponseEntity.ok(ApiResponse.ok(compensationService.createRecord(record, "API_USER", "SYSTEM")));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CompensationRecord>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(compensationService.updateStatus(id, body.get("status"), "API_USER", "SYSTEM")));
    }
}
