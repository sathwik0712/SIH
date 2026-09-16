# BHOOMISETU: National Land Acquisition & Resettlement Portal

BHOOMISETU is a unified digital ecosystem designed to streamline, track, and audit land acquisition projects across India in compliance with the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013**.

## Features for SIH 2026 Presentation
- **Statutory Workflow Tracking:** Strict adherence to Sec 4 through Sec 38 stages.
- **Live GIS Mapping:** Cadastral overlays for precise field verification.
- **Tamper-Evident Audit Trails:** Every action is logged immutably.
- **Automated Gazette Generation:** One-click PDF generation of Section 11 notices.
- **Citizen Portal:** Transparent grievance filing and compensation tracking.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, Leaflet (GIS), jsPDF (Gazettes).
- **Backend:** Spring Boot 3 (Java 17), Spring Data JPA, H2 In-Memory Database (for seamless demoing), SpringDoc (Swagger UI).

## How to Run Locally

### 1. Start the Backend
The backend runs an in-memory H2 database which seeds itself automatically on startup.
```bash
cd backend
./mvnw clean spring-boot:run
```
- API runs on `http://localhost:8080`
- Swagger UI available at `http://localhost:8080/swagger-ui.html`
- H2 Console available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:bhoomisetu_db`)

### 2. Start the Frontend
In a new terminal window:
```bash
npm install
npm run dev
```
- The frontend will be available at `http://localhost:5173`

## Demo Login Credentials
Use the following credentials to access different role-based views during the demo:

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| Central Ministry | `admin` | `admin123` | Full pan-India view |
| Land Acquiring Authority (NHAI) | `cala_pune` | `pune123` | Can advance workflow & generate gazettes |
| Field Officer | `field_officer` | `field123` | Can run GIS verifications |
| Citizen | *Click Citizen Portal* | N/A | Masked PII, grievance filing |

> **Note:** This is a prototype built for the Smart India Hackathon. The database resets upon restarting the Spring Boot server.
