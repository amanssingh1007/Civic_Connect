
package com.ccl.civicconnect.controller;

import com.ccl.civicconnect.entity.Issue;
import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.IssueRepository;
import com.ccl.civicconnect.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/issues")
public class PhotoController {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final Path uploadDirectory;

    public PhotoController(
            IssueRepository issueRepository,
            UserRepository userRepository,
            @Value("${app.upload.dir:uploads}") String uploadDir) {

        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    @GetMapping("/{issueId}/photo")
    public ResponseEntity<Resource> getPhoto(
            @PathVariable Long issueId,
            Authentication authentication) throws IOException {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Issue issue = issueRepository.findById(issueId).orElse(null);

        if (issue == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isAdmin = user.getRole() == com.ccl.civicconnect.security.Role.ADMIN;
        boolean isOwner = issue.getCitizen() != null
                && issue.getCitizen().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(403).build();
        }

        String photoKey = issue.getPhotoKey();

        if (photoKey == null || photoKey.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        Path photoPath = uploadDirectory.resolve(photoKey).normalize();

        if (!photoPath.startsWith(uploadDirectory)
                || !Files.isRegularFile(photoPath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(photoPath.toUri());

        String filename = photoKey.toLowerCase();
        MediaType mediaType;

        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (filename.endsWith(".png")) {
            mediaType = MediaType.IMAGE_PNG;
        } else if (filename.endsWith(".webp")) {
            mediaType = MediaType.parseMediaType("image/webp");
        } else {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(resource);
    }
}

// package com.ccl.civicconnect.controller;

// import com.ccl.civicconnect.entity.Issue;
// import com.ccl.civicconnect.entity.User;
// import com.ccl.civicconnect.repository.IssueRepository;
// import com.ccl.civicconnect.repository.UserRepository;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.io.Resource;
// import org.springframework.core.io.UrlResource;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;

// import java.io.IOException;
// import java.nio.file.Path;
// import java.nio.file.Paths;

// @RestController
// @RequestMapping("/api/issues")
// public class PhotoController {

//     private final IssueRepository issueRepository;
//     private final UserRepository userRepository;
//     private final Path uploadDirectory;

//     public PhotoController(
//             IssueRepository issueRepository,
//             UserRepository userRepository,
//             @Value("${app.upload.dir:uploads}") String uploadDir) {

//         this.issueRepository = issueRepository;
//         this.userRepository = userRepository;

//         this.uploadDirectory = Paths.get(uploadDir)
//                 .toAbsolutePath()
//                 .normalize();
//     }

//     @GetMapping("/{issueId}/photo")
//     public ResponseEntity<Resource> getPhoto(
//             @PathVariable Long issueId,
//             Authentication authentication) throws IOException {

//         User user = userRepository
//                 .findByEmail(authentication.getName())
//                 .orElseThrow(() ->
//                         new IllegalArgumentException("User not found"));

//         Issue issue = issueRepository.findById(issueId)
//                 .orElseThrow(() ->
//                         new IllegalArgumentException("Issue not found"));

//         boolean isAdmin = user.getRole().name().equals("ADMIN");
//         boolean isOwner = issue.getCitizen().getId().equals(user.getId());

//         if (!isAdmin && !isOwner) {
//             return ResponseEntity.status(403).build();
//         }

//         String photoKey = issue.getPhotoKey();

//         if (photoKey == null || photoKey.isBlank()) {
//             return ResponseEntity.notFound().build();
//         }

//         Path photoPath = uploadDirectory.resolve(photoKey).normalize();

//         if (!photoPath.startsWith(uploadDirectory)
//                 || !java.nio.file.Files.isRegularFile(photoPath)) {
//             return ResponseEntity.notFound().build();
//         }

//         Resource resource = new UrlResource(photoPath.toUri());

//         String filename = photoKey.toLowerCase();

//         MediaType mediaType;

//         if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
//             mediaType = MediaType.IMAGE_JPEG;
//         } else if (filename.endsWith(".png")) {
//             mediaType = MediaType.IMAGE_PNG;
//         } else if (filename.endsWith(".webp")) {
//             mediaType = MediaType.parseMediaType("image/webp");
//         } else {
//             return ResponseEntity.notFound().build();
//         }

//         return ResponseEntity.ok()
//                 .contentType(mediaType)
//                 .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                 .body(resource);
//     }
// }

