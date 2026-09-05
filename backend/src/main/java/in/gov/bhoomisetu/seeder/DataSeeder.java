package in.gov.bhoomisetu.seeder;

import in.gov.bhoomisetu.entity.*;
import in.gov.bhoomisetu.repository.*;
import in.gov.bhoomisetu.service.AuditService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ProjectRepository projectRepository,
                      LandParcelRepository landParcelRepository, AuditService auditService,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.landParcelRepository = landParcelRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
            seedProjectsAndParcels();
            seedInitialAuditLogs();
        }
    }

    private void seedUsers() {
        List<User> users = List.of(
            new User(
                "ministry.admin@nic.in",
                "Dr. Rajeshwar Sharma, IAS",
                "ministry.admin@nic.in",
                passwordEncoder.encode("admin123"),
                Role.CENTRAL_MINISTRY,
                "Joint Secretary (Land Resources)",
                "Department of Land Resources, MoRD",
                "All India",
                "National Scope",
                "Central Authority"
            ),
            new User(
                "state.maharashtra@nic.in",
                "Smt. Sunita Deshmukh",
                "state.maharashtra@nic.in",
                passwordEncoder.encode("state123"),
                Role.STATE_AUTHORITY,
                "Principal Secretary (Revenue)",
                "Revenue & Forest Department",
                "Maharashtra",
                "State Headquarters",
                "State Revenue Authority"
            ),
            new User(
                "dc.pune@nic.in",
                "Shri Anand Patil, IAS",
                "dc.pune@nic.in",
                passwordEncoder.encode("district123"),
                Role.DISTRICT_AUTHORITY,
                "District Collector & CALA",
                "District Collectorate Pune",
                "Maharashtra",
                "Pune",
                "Competent Authority for Land Acquisition"
            ),
            new User(
                "nhai.director@nic.in",
                "Er. Vikramaditya Singh",
                "nhai.director@nic.in",
                passwordEncoder.encode("nhai123"),
                Role.LAND_ACQUIRING_AUTHORITY,
                "Chief General Manager (Land)",
                "Land Acquisition Division",
                "Maharashtra",
                "Pune & Solapur",
                "National Highways Authority of India (NHAI)"
            ),
            new User(
                "fo.solapur@nic.in",
                "Shri Ganesh Kulkarni",
                "fo.solapur@nic.in",
                passwordEncoder.encode("field123"),
                Role.FIELD_OFFICER,
                "Senior Revenue Inspector / Patwari",
                "Land Records & Survey Division",
                "Maharashtra",
                "Solapur",
                "Solapur Revenue Office"
            ),
            new User(
                "viewer.audit@nic.in",
                "Smt. Manjula Rao",
                "viewer.audit@nic.in",
                passwordEncoder.encode("viewer123"),
                Role.EXECUTIVE_VIEWER,
                "Chief Vigilance & Social Impact Auditor",
                "National Audit & Compliance Cell",
                "All India",
                "National Scope",
                "Third-Party Oversight Wing"
            )
        );

        userRepository.saveAll(users);
    }

    private void seedProjectsAndParcels() {
        // Project 1: NH-65 Hyderabad–Pune Corridor
        Project p1 = new Project();
        p1.setProjectCode("NH65-HYD-PUN-01");
        p1.setProjectName("NH-65 Hyderabad–Pune 4/6 Lane Highway Corridor");
        p1.setState("Maharashtra");
        p1.setDistrict("Pune");
        p1.setAcquiringAuthority("NHAI");
        p1.setDescription("Widening and greenfield bypass construction across Pune and Solapur districts under Bharatmala Pariyojana.");
        p1.setAcquisitionStage("AWARD");
        p1.setStatus("ON_TRACK");
        p1.setTotalLandRequiredHectares(new BigDecimal("420.50"));
        p1.setTotalLandAcquiredHectares(new BigDecimal("315.20"));
        p1.setTotalParcels(128);
        p1.setVerifiedParcels(118);
        p1.setTotalAffectedFamilies(342);
        p1.setRehabilitatedFamilies(280);
        p1.setCompensationAssessedCr(new BigDecimal("186.40"));
        p1.setCompensationDisbursedCr(new BigDecimal("142.10"));
        p1.setNotificationDate(LocalDate.now().minusMonths(8));
        p1.setTargetCompletionDate(LocalDate.now().plusMonths(10));
        p1 = projectRepository.save(p1);

        // Project 2: Eastern Freight Corridor
        Project p2 = new Project();
        p2.setProjectCode("DFCCIL-EDFC-04");
        p2.setProjectName("Eastern Dedicated Freight Corridor - Section IV");
        p2.setState("Uttar Pradesh");
        p2.setDistrict("Varanasi");
        p2.setAcquiringAuthority("DFCCIL");
        p2.setDescription("Dedicated double-line electrified freight rail corridor connecting Ludhiana to Dankuni.");
        p2.setAcquisitionStage("NOTIFICATION");
        p2.setStatus("AT_RISK");
        p2.setTotalLandRequiredHectares(new BigDecimal("680.00"));
        p2.setTotalLandAcquiredHectares(new BigDecimal("290.40"));
        p2.setTotalParcels(210);
        p2.setVerifiedParcels(145);
        p2.setTotalAffectedFamilies(520);
        p2.setRehabilitatedFamilies(190);
        p2.setCompensationAssessedCr(new BigDecimal("310.00"));
        p2.setCompensationDisbursedCr(new BigDecimal("115.50"));
        p2.setNotificationDate(LocalDate.now().minusMonths(4));
        p2.setTargetCompletionDate(LocalDate.now().plusMonths(16));
        p2 = projectRepository.save(p2);

        // Project 3: Solar Renewable Energy Park
        Project p3 = new Project();
        p3.setProjectCode("SECI-SOLAR-TUM-01");
        p3.setProjectName("Pavagada Ultra Mega Solar Renewable Energy Park Phase II");
        p3.setState("Karnataka");
        p3.setDistrict("Tumakuru");
        p3.setAcquiringAuthority("SECI");
        p3.setDescription("2000 MW capacity solar photovoltaic generation park on dry non-agricultural land.");
        p3.setAcquisitionStage("POSSESSION");
        p3.setStatus("ON_TRACK");
        p3.setTotalLandRequiredHectares(new BigDecimal("1150.00"));
        p3.setTotalLandAcquiredHectares(new BigDecimal("1100.00"));
        p3.setTotalParcels(340);
        p3.setVerifiedParcels(340);
        p3.setTotalAffectedFamilies(410);
        p3.setRehabilitatedFamilies(402);
        p3.setCompensationAssessedCr(new BigDecimal("420.00"));
        p3.setCompensationDisbursedCr(new BigDecimal("405.00"));
        p3.setNotificationDate(LocalDate.now().minusMonths(14));
        p3.setTargetCompletionDate(LocalDate.now().plusMonths(3));
        p3 = projectRepository.save(p3);

        // Project 4: Industrial Corridor Development
        Project p4 = new Project();
        p4.setProjectCode("NICDC-DHOLERA-02");
        p4.setProjectName("Dholera Special Investment & Industrial Corridor Phase II");
        p4.setState("Gujarat");
        p4.setDistrict("Ahmedabad");
        p4.setAcquiringAuthority("NICDC");
        p4.setDescription("Smart city industrial node under Delhi Mumbai Industrial Corridor project.");
        p4.setAcquisitionStage("COMPENSATION");
        p4.setStatus("ON_TRACK");
        p4.setTotalLandRequiredHectares(new BigDecimal("890.00"));
        p4.setTotalLandAcquiredHectares(new BigDecimal("640.00"));
        p4.setTotalParcels(195);
        p4.setVerifiedParcels(182);
        p4.setTotalAffectedFamilies(380);
        p4.setRehabilitatedFamilies(290);
        p4.setCompensationAssessedCr(new BigDecimal("550.00"));
        p4.setCompensationDisbursedCr(new BigDecimal("390.00"));
        p4.setNotificationDate(LocalDate.now().minusMonths(9));
        p4.setTargetCompletionDate(LocalDate.now().plusMonths(8));
        p4 = projectRepository.save(p4);

        // Project 5: Shaktipeeth Expressway
        Project p5 = new Project();
        p5.setProjectCode("MSRDC-SHAKTI-03");
        p5.setProjectName("Nagpur-Goa Shaktipeeth Expressway Package 3");
        p5.setState("Maharashtra");
        p5.setDistrict("Solapur");
        p5.setAcquiringAuthority("State Industrial Dev Corp");
        p5.setDescription("Access-controlled greenfield expressway connecting pilgrim centres across Maharashtra.");
        p5.setAcquisitionStage("OBJECTION");
        p5.setStatus("DELAYED");
        p5.setTotalLandRequiredHectares(new BigDecimal("510.00"));
        p5.setTotalLandAcquiredHectares(new BigDecimal("120.00"));
        p5.setTotalParcels(160);
        p5.setVerifiedParcels(85);
        p5.setTotalAffectedFamilies(460);
        p5.setRehabilitatedFamilies(95);
        p5.setCompensationAssessedCr(new BigDecimal("240.00"));
        p5.setCompensationDisbursedCr(new BigDecimal("48.00"));
        p5.setNotificationDate(LocalDate.now().minusMonths(6));
        p5.setTargetCompletionDate(LocalDate.now().plusMonths(18));
        p5 = projectRepository.save(p5);

        // Project 6: Hyderabad Regional Ring Road
        Project p6 = new Project();
        p6.setProjectCode("NHAI-RRR-HYD-01");
        p6.setProjectName("Hyderabad Regional Ring Road (Northern Section)");
        p6.setState("Telangana");
        p6.setDistrict("Rangareddy");
        p6.setAcquiringAuthority("NHAI");
        p6.setDescription("340 km 4-lane expressway encircling Hyderabad outer agglomeration.");
        p6.setAcquisitionStage("VERIFICATION");
        p6.setStatus("ON_TRACK");
        p6.setTotalLandRequiredHectares(new BigDecimal("740.00"));
        p6.setTotalLandAcquiredHectares(new BigDecimal("180.00"));
        p6.setTotalParcels(230);
        p6.setVerifiedParcels(120);
        p6.setTotalAffectedFamilies(610);
        p6.setRehabilitatedFamilies(110);
        p6.setCompensationAssessedCr(new BigDecimal("390.00"));
        p6.setCompensationDisbursedCr(new BigDecimal("80.00"));
        p6.setNotificationDate(LocalDate.now().minusMonths(3));
        p6.setTargetCompletionDate(LocalDate.now().plusMonths(20));
        p6 = projectRepository.save(p6);

        // Project 7: High Speed Rail Vadodara Hub
        Project p7 = new Project();
        p7.setProjectCode("NHSRCL-MAHSR-06");
        p7.setProjectName("Mumbai-Ahmedabad High Speed Rail - Surat Hub");
        p7.setState("Gujarat");
        p7.setDistrict("Surat");
        p7.setAcquiringAuthority("NHSRCL");
        p7.setDescription("High speed bullet train station approach alignment and depot development.");
        p7.setAcquisitionStage("POSSESSION");
        p7.setStatus("ON_TRACK");
        p7.setTotalLandRequiredHectares(new BigDecimal("320.00"));
        p7.setTotalLandAcquiredHectares(new BigDecimal("310.00"));
        p7.setTotalParcels(115);
        p7.setVerifiedParcels(115);
        p7.setTotalAffectedFamilies(210);
        p7.setRehabilitatedFamilies(205);
        p7.setCompensationAssessedCr(new BigDecimal("480.00"));
        p7.setCompensationDisbursedCr(new BigDecimal("470.00"));
        p7.setNotificationDate(LocalDate.now().minusMonths(16));
        p7.setTargetCompletionDate(LocalDate.now().plusMonths(2));
        p7 = projectRepository.save(p7);

        // Project 8: Varanasi Multi-Modal Terminal
        Project p8 = new Project();
        p8.setProjectCode("IWAI-MMT-VAR-01");
        p8.setProjectName("Varanasi Multi-Modal Inland Waterways Freight Terminal Expansion");
        p8.setState("Uttar Pradesh");
        p8.setDistrict("Prayagraj");
        p8.setAcquiringAuthority("IWAI");
        p8.setDescription("National Waterway-1 logistics and container park terminal integration.");
        p8.setAcquisitionStage("RANDR");
        p8.setStatus("AT_RISK");
        p8.setTotalLandRequiredHectares(new BigDecimal("180.00"));
        p8.setTotalLandAcquiredHectares(new BigDecimal("115.00"));
        p8.setTotalParcels(78);
        p8.setVerifiedParcels(62);
        p8.setTotalAffectedFamilies(195);
        p8.setRehabilitatedFamilies(90);
        p8.setCompensationAssessedCr(new BigDecimal("95.00"));
        p8.setCompensationDisbursedCr(new BigDecimal("62.00"));
        p8.setNotificationDate(LocalDate.now().minusMonths(11));
        p8.setTargetCompletionDate(LocalDate.now().plusMonths(7));
        p8 = projectRepository.save(p8);

        // Project 9: Bengaluru Suburban Rail Corridor 2
        Project p9 = new Project();
        p9.setProjectCode("KRIDE-BSRP-C2");
        p9.setProjectName("Bengaluru Suburban Rail Corridor 2 (Baiyappanahalli–Chikkabanavara)");
        p9.setState("Karnataka");
        p9.setDistrict("Bengaluru Urban");
        p9.setAcquiringAuthority("K-RIDE");
        p9.setDescription("Dedicated suburban rail network corridor for Bengaluru metropolitan area.");
        p9.setAcquisitionStage("NOTIFICATION");
        p9.setStatus("ON_TRACK");
        p9.setTotalLandRequiredHectares(new BigDecimal("145.00"));
        p9.setTotalLandAcquiredHectares(new BigDecimal("65.00"));
        p9.setTotalParcels(84);
        p9.setVerifiedParcels(58);
        p9.setTotalAffectedFamilies(280);
        p9.setRehabilitatedFamilies(60);
        p9.setCompensationAssessedCr(new BigDecimal("320.00"));
        p9.setCompensationDisbursedCr(new BigDecimal("120.00"));
        p9.setNotificationDate(LocalDate.now().minusMonths(5));
        p9.setTargetCompletionDate(LocalDate.now().plusMonths(14));
        p9 = projectRepository.save(p9);

        // Project 10: Solapur Industrial Growth Centre
        Project p10 = new Project();
        p10.setProjectCode("MIDC-SOL-IND-02");
        p10.setProjectName("Solapur Industrial Growth Centre (MIDC Phase II)");
        p10.setState("Maharashtra");
        p10.setDistrict("Solapur");
        p10.setAcquiringAuthority("MIDC");
        p10.setDescription("Textile and manufacturing industrial park expansion with common effluent treatment.");
        p10.setAcquisitionStage("COMPENSATION");
        p10.setStatus("ON_TRACK");
        p10.setTotalLandRequiredHectares(new BigDecimal("350.00"));
        p10.setTotalLandAcquiredHectares(new BigDecimal("260.00"));
        p10.setTotalParcels(92);
        p10.setVerifiedParcels(88);
        p10.setTotalAffectedFamilies(175);
        p10.setRehabilitatedFamilies(140);
        p10.setCompensationAssessedCr(new BigDecimal("145.00"));
        p10.setCompensationDisbursedCr(new BigDecimal("118.00"));
        p10.setNotificationDate(LocalDate.now().minusMonths(8));
        p10.setTargetCompletionDate(LocalDate.now().plusMonths(6));
        p10 = projectRepository.save(p10);

        // Seed Land Parcels for Project 1 (NH-65)
        seedSampleParcels(p1);
    }

    private void seedSampleParcels(Project project) {
        LandParcel lp1 = new LandParcel();
        lp1.setParcelCode("LP-PUN-001");
        lp1.setProject(project);
        lp1.setSurveyNumber("142/1A");
        lp1.setKhasraNumber("KH-892");
        lp1.setVillage("Hadapsar Rural");
        lp1.setMandalOrTehsil("Haveli");
        lp1.setDistrict("Pune");
        lp1.setState("Maharashtra");
        lp1.setAreaHectares(new BigDecimal("3.45"));
        lp1.setLandType("Agricultural");
        lp1.setOwnershipType("Private");
        lp1.setOwnerName("Shri Tukaram Sambhaji Gaikwad");
        lp1.setOwnerContact("+91 98220 44123");
        lp1.setVerificationStatus("VERIFIED");
        lp1.setAcquisitionStatus("AWARD_DECLARED");
        lp1.setCompensationStatus("APPROVED");
        lp1.setCompensationAmountInr(new BigDecimal("14850000"));
        lp1.setLatitude(18.5089);
        lp1.setLongitude(73.9260);
        lp1.setFieldRemarks("Boundary demarcated with RCC boundary pillars. Joint measurement survey completed.");
        lp1.setVerifiedBy("Shri Ganesh Kulkarni (Field Officer)");
        lp1.setVerifiedAt(LocalDateTime.now().minusDays(18));
        landParcelRepository.save(lp1);

        LandParcel lp2 = new LandParcel();
        lp2.setParcelCode("LP-PUN-002");
        lp2.setProject(project);
        lp2.setSurveyNumber("142/1B");
        lp2.setKhasraNumber("KH-893");
        lp2.setVillage("Hadapsar Rural");
        lp2.setMandalOrTehsil("Haveli");
        lp2.setDistrict("Pune");
        lp2.setState("Maharashtra");
        lp2.setAreaHectares(new BigDecimal("2.10"));
        lp2.setLandType("Commercial");
        lp2.setOwnershipType("Private");
        lp2.setOwnerName("M/s Shinde Agro Cold Storage & Logistics");
        lp2.setOwnerContact("+91 94230 11980");
        lp2.setVerificationStatus("VERIFIED");
        lp2.setAcquisitionStatus("COMPENSATION_PAID");
        lp2.setCompensationStatus("DISBURSED");
        lp2.setCompensationAmountInr(new BigDecimal("28400000"));
        lp2.setLatitude(18.5105);
        lp2.setLongitude(73.9285);
        lp2.setFieldRemarks("Structure valuation completed by PWD valuer. Direct bank disbursement done via PFMS.");
        lp2.setVerifiedBy("Shri Ganesh Kulkarni (Field Officer)");
        lp2.setVerifiedAt(LocalDateTime.now().minusDays(12));
        landParcelRepository.save(lp2);

        LandParcel lp3 = new LandParcel();
        lp3.setParcelCode("LP-SOL-045");
        lp3.setProject(project);
        lp3.setSurveyNumber("88/4");
        lp3.setKhasraNumber("KH-314");
        lp3.setVillage("Mohol Khurd");
        lp3.setMandalOrTehsil("Mohol");
        lp3.setDistrict("Solapur");
        lp3.setState("Maharashtra");
        lp3.setAreaHectares(new BigDecimal("4.80"));
        lp3.setLandType("Agricultural");
        lp3.setOwnershipType("Private");
        lp3.setOwnerName("Shri Pandurang Maruti Shinde & 2 Others");
        lp3.setOwnerContact("+91 97631 88402");
        lp3.setVerificationStatus("FIELD_VISIT_SCHEDULED");
        lp3.setAcquisitionStatus("NOTIFIED");
        lp3.setCompensationStatus("PENDING");
        lp3.setCompensationAmountInr(new BigDecimal("12200000"));
        lp3.setLatitude(17.8150);
        lp3.setLongitude(75.6520);
        lp3.setFieldRemarks("Joint ownership apportionment pending verification under Section 11.");
        landParcelRepository.save(lp3);

        LandParcel lp4 = new LandParcel();
        lp4.setParcelCode("LP-SOL-046");
        lp4.setProject(project);
        lp4.setSurveyNumber("92/2");
        lp4.setKhasraNumber("KH-320");
        lp4.setVillage("Mohol Khurd");
        lp4.setMandalOrTehsil("Mohol");
        lp4.setDistrict("Solapur");
        lp4.setState("Maharashtra");
        lp4.setAreaHectares(new BigDecimal("1.75"));
        lp4.setLandType("Government Gairan");
        lp4.setOwnershipType("Government");
        lp4.setOwnerName("Government of Maharashtra (Revenue Dept)");
        lp4.setOwnerContact("Tahsildar Mohol");
        lp4.setVerificationStatus("VERIFIED");
        lp4.setAcquisitionStatus("POSSESSION_TAKEN");
        lp4.setCompensationStatus("APPROVED");
        lp4.setCompensationAmountInr(BigDecimal.ZERO);
        lp4.setLatitude(17.8182);
        lp4.setLongitude(75.6578);
        lp4.setFieldRemarks("Inter-departmental land transfer formal order issued by District Collector.");
        lp4.setVerifiedBy("Shri Ganesh Kulkarni (Field Officer)");
        lp4.setVerifiedAt(LocalDateTime.now().minusDays(25));
        landParcelRepository.save(lp4);

        LandParcel lp5 = new LandParcel();
        lp5.setParcelCode("LP-SOL-047");
        lp5.setProject(project);
        lp5.setSurveyNumber("104/3B");
        lp5.setKhasraNumber("KH-402");
        lp5.setVillage("Shetfal");
        lp5.setMandalOrTehsil("Mohol");
        lp5.setDistrict("Solapur");
        lp5.setState("Maharashtra");
        lp5.setAreaHectares(new BigDecimal("3.10"));
        lp5.setLandType("Agricultural");
        lp5.setOwnershipType("Private");
        lp5.setOwnerName("Smt. Rukmini Balasaheb Jadhav");
        lp5.setOwnerContact("+91 98902 33145");
        lp5.setVerificationStatus("PENDING");
        lp5.setAcquisitionStatus("OBJECTION_RAISED");
        lp5.setCompensationStatus("DISPUTED");
        lp5.setCompensationAmountInr(new BigDecimal("15500000"));
        lp5.setLatitude(17.8240);
        lp5.setLongitude(75.6690);
        lp5.setFieldRemarks("Objection filed under Section 15 regarding crop tree valuation and irrigation borewell.");
        landParcelRepository.save(lp5);
    }

    private void seedInitialAuditLogs() {
        auditService.logAction("SYSTEM", "SYSTEM", "SEED_DATABASE", "SYSTEM", "0", null, "INITIALIZED", "System initialized with 6 demo roles, 10 national land acquisition projects, and sample survey parcels.", "127.0.0.1");
        auditService.logAction("ministry.admin@nic.in", "CENTRAL_MINISTRY", "APPROVE_PROJECT", "PROJECTS", "NH65-HYD-PUN-01", "PROPOSAL", "AWARD", "National corridor package clearance accorded under RFCTLARR Act 2013.", "10.20.1.15");
        auditService.logAction("dc.pune@nic.in", "DISTRICT_AUTHORITY", "ISSUE_SECTION19", "NOTIFICATIONS", "NH65-HYD-PUN-01", "SECTION_11", "SECTION_19", "Declaration under Section 19(1) published in Official Gazette.", "10.45.2.8");
        auditService.logAction("fo.solapur@nic.in", "FIELD_OFFICER", "VERIFY_PARCEL", "VERIFICATION", "LP-PUN-001", "PENDING", "VERIFIED", "Survey boundary verified on site with DGPS measurement and farmer witness.", "10.45.8.21");
    }
}
