package com.jobportal.controller;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.Application;
import com.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApplicationDto.ApplicationResponse> apply(
            @RequestBody ApplicationDto.ApplyRequest request) {
        return ResponseEntity.ok(applicationService.applyToJob(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<ApplicationDto.ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getMyApplications(page, size));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<Page<ApplicationDto.ApplicationResponse>> getApplicationsForJob(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, page, size));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApplicationDto.ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody ApplicationDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, request.getStatus()));
    }
}
