package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.entity.SavedJob;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<Void> saveJob(@PathVariable Long jobId) {
        User user = getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!savedJobRepository.existsByUserAndJob(user, job)) {
            SavedJob saved = SavedJob.builder().user(user).job(job).build();
            savedJobRepository.save(saved);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsaveJob(@PathVariable Long jobId) {
        User user = getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        savedJobRepository.findByUserAndJob(user, job)
                .ifPresent(savedJobRepository::delete);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getMySaved() {
        User user = getCurrentUser();
        return ResponseEntity.ok(savedJobRepository.findByUser(user));
    }
}
