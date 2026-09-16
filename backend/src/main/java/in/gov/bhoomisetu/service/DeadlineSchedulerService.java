package in.gov.bhoomisetu.service;

import in.gov.bhoomisetu.entity.Project;
import in.gov.bhoomisetu.repository.ProjectRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DeadlineSchedulerService {

    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    public DeadlineSchedulerService(ProjectRepository projectRepository, AuditService auditService) {
        this.projectRepository = projectRepository;
        this.auditService = auditService;
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    public void checkStatutoryDeadlines() {
        List<Project> activeProjects = projectRepository.findAll().stream()
                .filter(p -> !p.getStatus().equals("COMPLETED"))
                .toList();

        LocalDate today = LocalDate.now();

        for (Project project : activeProjects) {
            if (project.getNotificationDate() != null) {
                // Section 19 deadline: 12 months from Sec 11 notification date
                LocalDate sec19Deadline = project.getNotificationDate().plusMonths(12);
                long daysOverdue = ChronoUnit.DAYS.between(sec19Deadline, today);
                
                if (daysOverdue > 0 && "NOTIFICATION".equals(project.getAcquisitionStage())) {
                    auditService.logAction(
                            "SYSTEM",
                            "SYSTEM_SCHEDULER",
                            "DEADLINE_OVERDUE",
                            "ALERTS",
                            project.getProjectCode(),
                            project.getStatus(),
                            "AT_RISK",
                            "Sec 19 Declaration is overdue by " + daysOverdue + " days. Risk of acquisition lapse.",
                            "127.0.0.1"
                    );
                    project.setStatus("AT_RISK");
                    projectRepository.save(project);
                }
            }
        }
    }
}
