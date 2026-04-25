package com.jobportal.repository;

import com.jobportal.entity.Referral;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByReferrer(User referrer);
    List<Referral> findByCandidateEmail(String email);

    @Query("SELECT r.referrer, COUNT(r) as referralCount FROM Referral r " +
           "GROUP BY r.referrer ORDER BY referralCount DESC")
    List<Object[]> getLeaderboard();
}
