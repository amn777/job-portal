package com.jobportal.service;

import com.jobportal.dto.JobDto;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("activeJobs", jobRepository.findAll().stream().filter(j -> j.isActive()).count());

        List<Map<String, Object>> monthlyData = applicationRepository.countApplicationsByMonth()
                .stream()
                .map(row -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", row[0]);
                    m.put("count", row[1]);
                    return m;
                })
                .collect(Collectors.toList());
        stats.put("monthlyApplications", monthlyData);
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void toggleJobStatus(Long jobId) {
        jobRepository.findById(jobId).ifPresent(job -> {
            job.setActive(!job.isActive());
            jobRepository.save(job);
        });
    }
}
