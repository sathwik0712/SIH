package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        
        // Handle frontend's 'ALL' value as null to ignore filtering
        String filterState = "ALL".equalsIgnoreCase(state) ? null : state;
        String filterDistrict = "ALL".equalsIgnoreCase(district) ? null : district;
        
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getDashboardStats(filterState, filterDistrict)));
    }
}
