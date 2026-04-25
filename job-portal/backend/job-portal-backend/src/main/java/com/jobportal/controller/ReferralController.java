package com.jobportal.controller;

import com.jobportal.dto.ReferralDto;
import com.jobportal.service.ReferralService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping
    public ResponseEntity<ReferralDto.ReferralResponse> createReferral(
            @Valid @RequestBody ReferralDto.CreateReferralRequest request) {
        return ResponseEntity.ok(referralService.createReferral(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReferralDto.ReferralResponse>> getMyReferrals() {
        return ResponseEntity.ok(referralService.getMyReferrals());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<ReferralDto.LeaderboardEntry>> getLeaderboard() {
        return ResponseEntity.ok(referralService.getLeaderboard());
    }
}
