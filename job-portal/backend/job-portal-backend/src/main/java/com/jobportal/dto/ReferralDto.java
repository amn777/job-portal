package com.jobportal.dto;

import com.jobportal.entity.Referral;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class ReferralDto {

    @Data
    public static class CreateReferralRequest {
        @NotBlank(message = "Candidate name is required")
        private String candidateName;

        @NotBlank(message = "Candidate email is required")
        @Email(message = "Invalid email format")
        private String candidateEmail;

        @NotNull(message = "Job ID is required")
        private Long jobId;
    }

    @Data
    public static class ReferralResponse {
        private Long id;
        private String referrerName;
        private String referrerEmail;
        private String candidateName;
        private String candidateEmail;
        private String jobTitle;
        private String company;
        private Long jobId;
        private String status;
        private LocalDateTime referredAt;

        public static ReferralResponse from(Referral r) {
            ReferralResponse res = new ReferralResponse();
            res.setId(r.getId());
            res.setCandidateName(r.getCandidateName());
            res.setCandidateEmail(r.getCandidateEmail());
            res.setStatus(r.getStatus().name());
            res.setReferredAt(r.getReferredAt());
            if (r.getReferrer() != null) {
                res.setReferrerName(r.getReferrer().getName());
                res.setReferrerEmail(r.getReferrer().getEmail());
            }
            if (r.getJob() != null) {
                res.setJobTitle(r.getJob().getTitle());
                res.setCompany(r.getJob().getCompany());
                res.setJobId(r.getJob().getId());
            }
            return res;
        }
    }

    @Data
    public static class LeaderboardEntry {
        private Long userId;
        private String name;
        private String email;
        private Long referralCount;
    }
}
