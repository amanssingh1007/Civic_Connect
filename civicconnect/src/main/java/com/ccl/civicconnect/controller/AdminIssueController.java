
package com.ccl.civicconnect.controller;

import com.ccl.civicconnect.entity.Issue;
import com.ccl.civicconnect.service.IssueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/issues")
public class AdminIssueController {

    private final IssueService issueService;

    public AdminIssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    public ResponseEntity<?> getAllIssues() {

        List<Issue> issues = issueService.getAllIssues();

        List<Map<String, Object>> response = issues.stream()
                .map(issue -> {
                    Map<String, Object> item = new LinkedHashMap<>();

                    item.put("id", issue.getId());
                    item.put("title", issue.getTitle());
                    item.put("photoKey", issue.getPhotoKey());
                    item.put("description", issue.getDescription());
                    item.put("location", issue.getLocation());
                    item.put("status", issue.getStatus());
                    item.put("createdAt", issue.getCreatedAt().toString());
                    item.put("citizenName", issue.getCitizen().getName());
                    item.put("citizenEmail", issue.getCitizen().getEmail());

                    return item;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{issueId}/done")
    public ResponseEntity<?> markIssueAsDone(
            @PathVariable Long issueId) {

        try {
            Issue issue = issueService.markIssueAsDone(issueId);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Issue marked as DONE",
                            "id", issue.getId(),
                            "status", issue.getStatus()));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

}
