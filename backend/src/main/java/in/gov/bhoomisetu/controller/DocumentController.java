package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final AuditService auditService;

    public DocumentController(AuditService auditService) {
        this.auditService = auditService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "projectId", required = false) String projectId,
            @RequestParam(value = "documentType", required = false) String documentType) {
        
        // In a real application, we would save the file to a storage service (S3, local disk, database blob).
        // For this demo, we simulate saving the file.
        
        Map<String, String> response = new HashMap<>();
        response.put("fileName", file.getOriginalFilename());
        response.put("fileSize", String.valueOf(file.getSize()));
        response.put("documentType", documentType != null ? documentType : "GENERAL");
        response.put("status", "UPLOADED");
        response.put("documentId", "DOC-" + System.currentTimeMillis());

        auditService.logAction("API_USER", "SYSTEM", "UPLOAD_DOCUMENT", "COMPLIANCE", 
                response.get("documentId"), "NONE", "UPLOADED", 
                "Uploaded document: " + file.getOriginalFilename(), "127.0.0.1");

        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
