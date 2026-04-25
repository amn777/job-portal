package com.jobportal.dto;

import com.jobportal.entity.Application;
import lombok.Data;
import java.time.LocalDateTime;

public class ApplicationDto {

    @Data
    public static class ApplyRequest {
        private Long jobId;
        private String resumeUrl;
        private String coverLetter;
    }

    @Data
    public static class ApplicationResponse {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String company;
        private Long userId;
        private String userName;
        private String userEmail;
        private String resumeUrl;
        private String coverLetter;
        private String status;
        private LocalDateTime appliedAt;

        public static ApplicationResponse from(Application app) {
            ApplicationResponse r = new ApplicationResponse();
            r.setId(app.getId());
            r.setStatus(app.getStatus().name());
            r.setResumeUrl(app.getResumeUrl());
            r.setCoverLetter(app.getCoverLetter());
            r.setAppliedAt(app.getAppliedAt());
            if (app.getJob() != null) {
                r.setJobId(app.getJob().getId());
                r.setJobTitle(app.getJob().getTitle());
                r.setCompany(app.getJob().getCompany());
            }
            if (app.getUser() != null) {
                r.setUserId(app.getUser().getId());
                r.setUserName(app.getUser().getName());
                r.setUserEmail(app.getUser().getEmail());
            }
            return r;
        }
    }

    @Data
    public static class UpdateStatusRequest {
        private Application.Status status;
    }
}
