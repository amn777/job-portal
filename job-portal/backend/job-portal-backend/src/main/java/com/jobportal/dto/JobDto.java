package com.jobportal.dto;

import com.jobportal.entity.Job;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class JobDto {

    @Data
    public static class CreateJobRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Company is required")
        private String company;

        @NotBlank(message = "Location is required")
        private String location;

        private String salary;
        private String description;
        private String requirements;
        private String jobType;
    }

    @Data
    public static class JobResponse {
        private Long id;
        private String title;
        private String company;
        private String location;
        private String salary;
        private String description;
        private String requirements;
        private String jobType;
        private boolean active;
        private String createdByName;
        private Long createdById;
        private LocalDateTime createdAt;
        private long applicationCount;

        public static JobResponse from(Job job) {
            JobResponse r = new JobResponse();
            r.setId(job.getId());
            r.setTitle(job.getTitle());
            r.setCompany(job.getCompany());
            r.setLocation(job.getLocation());
            r.setSalary(job.getSalary());
            r.setDescription(job.getDescription());
            r.setRequirements(job.getRequirements());
            r.setJobType(job.getJobType());
            r.setActive(job.isActive());
            r.setCreatedAt(job.getCreatedAt());
            if (job.getCreatedBy() != null) {
                r.setCreatedByName(job.getCreatedBy().getName());
                r.setCreatedById(job.getCreatedBy().getId());
            }
            return r;
        }
    }
}
