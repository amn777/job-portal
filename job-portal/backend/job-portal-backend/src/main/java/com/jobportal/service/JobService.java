package com.jobportal.service;

import com.jobportal.dto.JobDto;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public JobDto.JobResponse createJob(JobDto.CreateJobRequest request) {
        User user = getCurrentUser();
        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .salary(request.getSalary())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .jobType(request.getJobType())
                .active(true)
                .createdBy(user)
                .build();
        return JobDto.JobResponse.from(jobRepository.save(job));
    }

    public Page<JobDto.JobResponse> getAllJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.findByActiveTrue(pageable)
                .map(job -> {
                    JobDto.JobResponse res = JobDto.JobResponse.from(job);
                    res.setApplicationCount(applicationRepository.countByJob(job));
                    return res;
                });
    }

    public Page<JobDto.JobResponse> searchJobs(String keyword, String location, String jobType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.searchJobs(
                keyword != null && !keyword.isBlank() ? keyword : null,
                location != null && !location.isBlank() ? location : null,
                jobType != null && !jobType.isBlank() ? jobType : null,
                pageable
        ).map(JobDto.JobResponse::from);
    }

    public JobDto.JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        JobDto.JobResponse res = JobDto.JobResponse.from(job);
        res.setApplicationCount(applicationRepository.countByJob(job));
        return res;
    }

    public JobDto.JobResponse updateJob(Long id, JobDto.CreateJobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setJobType(request.getJobType());
        return JobDto.JobResponse.from(jobRepository.save(job));
    }

    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        job.setActive(false);
        jobRepository.save(job);
    }

    public Page<JobDto.JobResponse> getMyJobs(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return jobRepository.findByCreatedByAndActiveTrue(user, pageable)
                .map(job -> {
                    JobDto.JobResponse res = JobDto.JobResponse.from(job);
                    res.setApplicationCount(applicationRepository.countByJob(job));
                    return res;
                });
    }
}
