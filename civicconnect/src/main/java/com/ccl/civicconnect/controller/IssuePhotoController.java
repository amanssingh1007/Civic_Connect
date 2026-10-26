
package com.ccl.civicconnect.controller;

import com.ccl.civicconnect.entity.Issue;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.IssueRepository;
import com.ccl.civicconnect.repository.UserRepository;
import com.ccl.civicconnect.service.PhotoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
public class IssuePhotoController {

    private final PhotoService photoService;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public IssuePhotoController(
            PhotoService photoService,
            IssueRepository issueRepository,
            UserRepository userRepository) {
        this.photoService = photoService;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{issueId}/photo")
    public ResponseEntity<?> uploadPhoto(
            @PathVariable Long issueId,
            @RequestParam("photo") MultipartFile photo,
            Authentication authentication) {

        try {
            User citizen = userRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow(() ->
                            new IllegalArgumentException("User not found"));

            Issue issue = issueRepository.findById(issueId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("Issue not found"));

            if (!issue.getCitizen().getId().equals(citizen.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message",
                                "You can upload photos only to your own issues"));
            }

            String filename = photoService.savePhoto(photo);

            issue.setPhotoKey(filename);
            issueRepository.save(issue);

            return ResponseEntity.ok(Map.of(
                    "message", "Photo uploaded successfully",
                    "issueId", issue.getId(),
                    "photoKey", filename
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unable to save photo"));
        }
    }
}

