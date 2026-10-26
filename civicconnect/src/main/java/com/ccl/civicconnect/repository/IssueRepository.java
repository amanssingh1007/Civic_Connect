
package com.ccl.civicconnect.repository;

import com.ccl.civicconnect.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    List<Issue> findAllByOrderByCreatedAtDesc();

    List<Issue> findByStatusOrderByCreatedAtDesc(String status);
}

