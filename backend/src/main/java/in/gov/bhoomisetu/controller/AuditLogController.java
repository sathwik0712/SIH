package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.entity.AuditLog;
import in.gov.bhoomisetu.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditService auditService;

    public AuditLogController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentAuditLogs(
            @RequestParam(required = false) String module) {
        if (module != null && !module.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(auditService.getLogsByModule(module)));
        }
        return ResponseEntity.ok(ApiResponse.ok(auditService.getRecentLogs()));
    }
}
