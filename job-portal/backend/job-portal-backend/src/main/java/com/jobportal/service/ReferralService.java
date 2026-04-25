package com.jobportal.service;

import com.jobportal.dto.ReferralDto;
import com.jobportal.entity.Job;
import com.jobportal.entity.Referral;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ReferralRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final ReferralRepository referralRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ReferralDto.ReferralResponse createReferral(ReferralDto.CreateReferralRequest request) {
        User referrer = getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Referral referral = Referral.builder()
                .referrer(referrer)
                .candidateEmail(request.getCandidateEmail())
                .candidateName(request.getCandidateName())
                .job(job)
                .build();

        Referral saved = referralRepository.save(referral);

        // Send referral email to candidate
        emailService.sendReferralEmail(
                request.getCandidateEmail(),
                request.getCandidateName(),
                referrer.getName(),
                job.getTitle(),
                job.getCompany(),
                job.getId()
        );

        return ReferralDto.ReferralResponse.from(saved);
    }

    public List<ReferralDto.ReferralResponse> getMyReferrals() {
        User user = getCurrentUser();
        return referralRepository.findByReferrer(user)
                .stream()
                .map(ReferralDto.ReferralResponse::from)
                .collect(Collectors.toList());
    }

    public List<ReferralDto.LeaderboardEntry> getLeaderboard() {
        return referralRepository.getLeaderboard()
                .stream()
                .map(row -> {
                    User user = (User) row[0];
                    Long count = (Long) row[1];
                    ReferralDto.LeaderboardEntry entry = new ReferralDto.LeaderboardEntry();
                    entry.setUserId(user.getId());
                    entry.setName(user.getName());
                    entry.setEmail(user.getEmail());
                    entry.setReferralCount(count);
                    return entry;
                })
                .collect(Collectors.toList());
    }
}
