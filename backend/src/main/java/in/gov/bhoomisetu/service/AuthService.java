package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.dto.AuthDTOs.*;
import in.gov.bhoomisetu.entity.Role;
import in.gov.bhoomisetu.entity.User;
import in.gov.bhoomisetu.repository.UserRepository;
import in.gov.bhoomisetu.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils, AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse authenticate(LoginRequest request, String ipAddress) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid User ID or Password");
        }

        User user = userOptional.get();

        // In demo prototype mode: match encoded password or allow direct demo match
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) && !user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid User ID or Password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());
        List<String> permissions = getPermissionsForRole(user.getRole());

        auditService.logAction(
                user.getUsername(),
                user.getRole().name(),
                "LOGIN",
                "AUTH",
                user.getId().toString(),
                null,
                "SUCCESS",
                "User successfully logged in via Web Portal",
                ipAddress
        );

        return new AuthResponse(token, toDTO(user), permissions);
    }

    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return toDTO(user);
    }

    public List<DemoUserDTO> getDemoAccounts() {
        List<DemoUserDTO> demoUsers = new ArrayList<>();
        demoUsers.add(new DemoUserDTO("ministry.admin@nic.in", "Dr. Rajeshwar Sharma, IAS", "Central Ministry", "Joint Secretary (Land Resources)", "All India", "National Scope", "admin123"));
        demoUsers.add(new DemoUserDTO("state.maharashtra@nic.in", "Smt. Sunita Deshmukh", "State Authority", "Principal Secretary (Revenue), Maharashtra", "Maharashtra", "State Level", "state123"));
        demoUsers.add(new DemoUserDTO("dc.pune@nic.in", "Shri Anand Patil, IAS", "District Authority", "District Collector & CALA, Pune", "Maharashtra", "Pune", "district123"));
        demoUsers.add(new DemoUserDTO("nhai.director@nic.in", "Er. Vikramaditya Singh", "Land Acquiring Authority", "Chief General Manager (Land), NHAI", "Maharashtra / Telangana", "Corridor Operations", "nhai123"));
        demoUsers.add(new DemoUserDTO("fo.solapur@nic.in", "Shri Ganesh Kulkarni", "Field Officer", "Senior Revenue Inspector / Patwari", "Maharashtra", "Solapur / Mohol", "field123"));
        demoUsers.add(new DemoUserDTO("viewer.audit@nic.in", "Smt. Manjula Rao", "Executive/Viewer", "Chief Vigilance & Social Impact Auditor", "All India", "National Compliance", "viewer123"));
        return demoUsers;
    }

    public List<String> getPermissionsForRole(Role role) {
        List<String> permissions = new ArrayList<>();
        permissions.add("VIEW_DASHBOARD");

        switch (role) {
            case CENTRAL_MINISTRY:
                permissions.addAll(List.of(
                        "VIEW_ALL_STATES", "VIEW_NATIONAL_ANALYTICS", "EXPORT_MIS_REPORTS",
                        "VIEW_AUDIT_LOGS", "ESCALATE_CASES", "VIEW_PROJECTS", "VIEW_PARCELS",
                        "VIEW_AWARDS", "VIEW_COMPENSATION", "VIEW_RANDR", "VIEW_POSSESSION"
                ));
                break;
            case STATE_AUTHORITY:
                permissions.addAll(List.of(
                        "VIEW_STATE_PROJECTS", "APPROVE_STATE_NOTIFICATIONS", "EXPORT_MIS_REPORTS",
                        "VIEW_AUDIT_LOGS", "VIEW_PROJECTS", "VIEW_PARCELS", "VIEW_AWARDS",
                        "VIEW_COMPENSATION", "VIEW_RANDR", "VIEW_POSSESSION"
                ));
                break;
            case DISTRICT_AUTHORITY:
                permissions.addAll(List.of(
                        "MANAGE_DISTRICT_PROJECTS", "ISSUE_SECTION11", "ISSUE_SECTION19",
                        "APPROVE_VERIFICATION", "GENERATE_AWARD", "DISBURSE_COMPENSATION",
                        "ORDER_POSSESSION", "UPDATE_RANDR", "VIEW_AUDIT_LOGS", "VIEW_PROJECTS", "VIEW_PARCELS"
                ));
                break;
            case LAND_ACQUIRING_AUTHORITY:
                permissions.addAll(List.of(
                        "CREATE_PROJECT", "CREATE_PARCEL", "UPLOAD_REQUISITIONS",
                        "UPLOAD_DOCUMENTS", "VIEW_PROJECTS", "VIEW_PARCELS", "VIEW_GIS_MAP"
                ));
                break;
            case FIELD_OFFICER:
                permissions.addAll(List.of(
                        "MOBILE_FIELD_VERIFY", "RECORD_GPS_SURVEY", "UPLOAD_SITE_PHOTOS",
                        "SUBMIT_VERIFICATION_CHECKLIST", "RECORD_POSSESSION_HANDOVER", "VIEW_PARCELS"
                ));
                break;
            case EXECUTIVE_VIEWER:
                permissions.addAll(List.of(
                        "VIEW_PROJECTS", "VIEW_PARCELS", "VIEW_AWARDS", "VIEW_COMPENSATION",
                        "VIEW_RANDR", "VIEW_REPORTS", "VIEW_AUDIT_LOGS", "VIEW_GIS_MAP"
                ));
                break;
        }
        return permissions;
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setRoleDisplayName(user.getRole().getDisplayName());
        dto.setDesignation(user.getDesignation());
        dto.setDepartment(user.getDepartment());
        dto.setState(user.getState());
        dto.setDistrict(user.getDistrict());
        dto.setAcquiringAuthority(user.getAcquiringAuthority());
        return dto;
    }
}
