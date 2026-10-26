
package com.ccl.civicconnect.controller;

import com.ccl.civicconnect.dto.CreateIssueRequest;
import com.ccl.civicconnect.entity.Issue;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.UserRepository;
import com.ccl.civicconnect.service.IssueService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

        private final IssueService issueService;
        private final UserRepository userRepository;

        public IssueController(
                        IssueService issueService,
                        UserRepository userRepository) {
                this.issueService = issueService;
                this.userRepository = userRepository;
        }

        @PostMapping
        public ResponseEntity<?> createIssue(
                        @Valid @RequestBody CreateIssueRequest request,
                        Authentication authentication) {

                User citizen = userRepository
                                .findByEmail(authentication.getName())
                                .orElseThrow(() -> new IllegalArgumentException("Citizen not found"));

                Issue issue = issueService.createIssue(request, citizen);

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                Map.of(
                                                "message", "Issue submitted successfully",
                                                "id", issue.getId(),
                                                "title", issue.getTitle(),
                                                "description", issue.getDescription(),
                                                "location", issue.getLocation(),
                                                "status", issue.getStatus(),
                                                "createdAt", issue.getCreatedAt().toString(),
                                        "photoKey", issue.getPhotoKey() == null ? "" : issue.getPhotoKey()));
        }

        @GetMapping("/khud")
        public ResponseEntity<?> getCurrentUser(
                        org.springframework.security.core.Authentication authentication) {

                return ResponseEntity.ok(
                                Map.of("email", authentication.getName()));
        }

        @GetMapping("/my")
        public ResponseEntity<?> getMyIssues(Authentication authentication) {

                User citizen = userRepository
                                .findByEmail(authentication.getName())
                                .orElseThrow(() -> new IllegalArgumentException("Citizen not found"));

                java.util.List<Issue> issues = issueService.getIssuesByCitizen(citizen.getId());

                java.util.List<Map<String, Object>> response = issues.stream()
                                .map(issue -> {
                                        Map<String, Object> item = new java.util.LinkedHashMap<>();
                                        item.put("id", issue.getId());
                                        item.put("title", issue.getTitle());
                                        item.put("description", issue.getDescription());
                                        item.put("location", issue.getLocation());
                                        item.put("status", issue.getStatus());
                                        item.put("photoKey", issue.getPhotoKey());
                                        item.put("createdAt", issue.getCreatedAt().toString());
                                        return item;
                                })
                                .toList();

                return ResponseEntity.ok(response);
        }

}
