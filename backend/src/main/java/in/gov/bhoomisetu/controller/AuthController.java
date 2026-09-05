package in.gov.bhoomisetu.controller;

import in.gov.bhoomisetu.dto.ApiResponse;
import in.gov.bhoomisetu.dto.AuthDTOs.*;
import in.gov.bhoomisetu.entity.Role;
import in.gov.bhoomisetu.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        AuthResponse response = authService.authenticate(request, ipAddress);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        UserDTO user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @GetMapping("/demo-accounts")
    public ResponseEntity<ApiResponse<List<DemoUserDTO>>> getDemoAccounts() {
        return ResponseEntity.ok(ApiResponse.ok(authService.getDemoAccounts()));
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getAvailableRoles() {
        List<Map<String, String>> roles = Arrays.stream(Role.values())
                .map(r -> Map.of(
                        "name", r.name(),
                        "displayName", r.getDisplayName(),
                        "description", r.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(roles));
    }
}
