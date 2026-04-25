package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id", nullable = false)
    @ToString.Exclude
    private User referrer;

    @Column(name = "candidate_email", nullable = false)
    private String candidateEmail;

    @Column(name = "candidate_name")
    private String candidateName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @ToString.Exclude
    private Job job;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "referred_at")
    private LocalDateTime referredAt;

    @PrePersist
    protected void onCreate() {
        referredAt = LocalDateTime.now();
        status = Status.PENDING;
    }

    public enum Status {
        PENDING, APPLIED, SHORTLISTED, HIRED, REJECTED
    }
}
