
package com.ccl.civicconnect.service;

import com.ccl.civicconnect.dto.CreateIssueRequest;
import com.ccl.civicconnect.entity.Issue;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @Transactional
    public Issue createIssue(CreateIssueRequest request, User citizen) {

        Issue issue = new Issue();

        issue.setTitle(request.getTitle().trim());
        issue.setDescription(request.getDescription().trim());
        issue.setLocation(request.getLocation().trim());
        issue.setCitizen(citizen);
        issue.setStatus("PENDING");
        issue.setPhotoKey(null);

        return issueRepository.save(issue);
    }

    public java.util.List<Issue> getIssuesByCitizen(Long citizenId) {
        return issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    public java.util.List<Issue> getAllIssues() {
        return issueRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Issue markIssueAsDone(Long issueId) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        issue.setStatus("DONE");

        return issueRepository.save(issue);
    }

}
