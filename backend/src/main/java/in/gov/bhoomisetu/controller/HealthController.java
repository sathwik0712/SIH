package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "status", "UP",
                "application", "BHOOMISETU - National Land Acquisition & Management System",
                "version", "1.0.0-PROTOTYPE",
                "timestamp", LocalDateTime.now(),
                "database", "PostgreSQL Compatible (H2 In-Memory Data Layer)",
                "governanceTier", "Government of India NIC Specification"
        )));
    }
}
