package com.jobportal.repository;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByUser(User user, Pageable pageable);
    Page<Application> findByJob(Job job, Pageable pageable);
    Optional<Application> findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
    long countByJob(Job job);

    @Query("SELECT FUNCTION('MONTH', a.appliedAt) as month, COUNT(a) as count " +
           "FROM Application a GROUP BY FUNCTION('MONTH', a.appliedAt) ORDER BY FUNCTION('MONTH', a.appliedAt)")
    List<Object[]> countApplicationsByMonth();
}
