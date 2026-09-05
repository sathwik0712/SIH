package in.gov.bhoomisetu.dto;

import in.gov.bhoomisetu.entity.Role;
import java.util.List;

public class AuthDTOs {

    public static class LoginRequest {
        private String username;
        private String password;
        private String captcha;
        private String selectedRole;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getCaptcha() { return captcha; }
        public void setCaptcha(String captcha) { this.captcha = captcha; }

        public String getSelectedRole() { return selectedRole; }
        public void setSelectedRole(String selectedRole) { this.selectedRole = selectedRole; }
    }

    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserDTO user;
        private List<String> permissions;

        public AuthResponse() {}

        public AuthResponse(String token, UserDTO user, List<String> permissions) {
            this.token = token;
            this.user = user;
            this.permissions = permissions;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }

        public UserDTO getUser() { return user; }
        public void setUser(UserDTO user) { this.user = user; }

        public List<String> getPermissions() { return permissions; }
        public void setPermissions(List<String> permissions) { this.permissions = permissions; }
    }

    public static class UserDTO {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private Role role;
        private String roleDisplayName;
        private String designation;
        private String department;
        private String state;
        private String district;
        private String acquiringAuthority;

        public UserDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getRoleDisplayName() { return roleDisplayName; }
        public void setRoleDisplayName(String roleDisplayName) { this.roleDisplayName = roleDisplayName; }

        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getAcquiringAuthority() { return acquiringAuthority; }
        public void setAcquiringAuthority(String acquiringAuthority) { this.acquiringAuthority = acquiringAuthority; }
    }

    public static class DemoUserDTO {
        private String username;
        private String fullName;
        private String roleName;
        private String designation;
        private String state;
        private String district;
        private String password;

        public DemoUserDTO(String username, String fullName, String roleName, String designation, String state, String district, String password) {
            this.username = username;
            this.fullName = fullName;
            this.roleName = roleName;
            this.designation = designation;
            this.state = state;
            this.district = district;
            this.password = password;
        }

        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getRoleName() { return roleName; }
        public String getDesignation() { return designation; }
        public String getState() { return state; }
        public String getDistrict() { return district; }
        public String getPassword() { return password; }
    }
}
