package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.SavedJob;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
    void deleteByUserAndJob(User user, Job job);
}
