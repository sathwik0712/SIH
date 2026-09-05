package in.gov.bhoomisetu.entity;

public enum Role {
    CENTRAL_MINISTRY("Central Ministry", "National oversight, all states/projects, high-level approvals and national analytics"),
    STATE_AUTHORITY("State Authority", "State-level oversight, district coordination, state land revenue reviews"),
    DISTRICT_AUTHORITY("District Authority", "District Collector/CALA, notifications, award generation, possession orders"),
    LAND_ACQUIRING_AUTHORITY("Land Acquiring Authority", "Requiring bodies e.g. NHAI/DFCCIL/SECI, project proposal & parcel uploads"),
    FIELD_OFFICER("Field Officer", "Revenue Inspector/Patwari, ground verification, survey numbers, GPS & photo upload"),
    EXECUTIVE_VIEWER("Executive/Viewer", "Read-only auditor, compliance observer, MIS report viewer");

    private final String displayName;
    private final String description;

    Role(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
