package com.jobportal.service;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.Referral;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ReferralRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ReferralRepository referralRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ApplicationDto.ApplicationResponse applyToJob(ApplicationDto.ApplyRequest request) {
        User user = getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByUserAndJob(user, job)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = Application.builder()
                .user(user)
                .job(job)
                .resumeUrl(request.getResumeUrl())
                .coverLetter(request.getCoverLetter())
                .build();

        Application saved = applicationRepository.save(application);

        // Check if this user was referred for this job
        List<Referral> referrals = referralRepository.findByCandidateEmail(user.getEmail());
        referrals.stream()
                .filter(r -> r.getJob().getId().equals(job.getId()))
                .forEach(r -> {
                    r.setStatus(Referral.Status.APPLIED);
                    referralRepository.save(r);
                });

        // Notify recruiter
        notificationService.createNotification(
                job.getCreatedBy(),
                String.format("%s applied for %s", user.getName(), job.getTitle())
        );

        // Send email confirmation to applicant
        emailService.sendApplicationConfirmation(user.getEmail(), user.getName(), job.getTitle(), job.getCompany());

        return ApplicationDto.ApplicationResponse.from(saved);
    }

    public Page<ApplicationDto.ApplicationResponse> getMyApplications(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return applicationRepository.findByUser(user, pageable)
                .map(ApplicationDto.ApplicationResponse::from);
    }

    public Page<ApplicationDto.ApplicationResponse> getApplicationsForJob(Long jobId, int page, int size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return applicationRepository.findByJob(job, pageable)
                .map(ApplicationDto.ApplicationResponse::from);
    }

    public ApplicationDto.ApplicationResponse updateApplicationStatus(Long applicationId, Application.Status status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        Application saved = applicationRepository.save(application);

        // Notify applicant of status change
        String message = String.format(
                "Your application for %s at %s has been updated to: %s",
                application.getJob().getTitle(),
                application.getJob().getCompany(),
                status.name()
        );
        notificationService.createNotification(application.getUser(), message);
        emailService.sendStatusUpdate(
                application.getUser().getEmail(),
                application.getUser().getName(),
                application.getJob().getTitle(),
                status.name()
        );

        return ApplicationDto.ApplicationResponse.from(saved);
    }
}
