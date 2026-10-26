
package com.ccl.civicconnect.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class PhotoService {

    private final Path uploadDirectory;

    public PhotoService(
            @Value("${app.upload.dir:uploads}") String uploadDir) {

        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

         System.out.println("PHOTO UPLOAD DIRECTORY: " + uploadDirectory);        
    }

    public String savePhoto(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a photo");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Photo size must not exceed 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.matches("^image/(jpeg|png|webp)$")) {
            throw new IllegalArgumentException(
                    "Only JPG, PNG and WEBP photos are allowed"
            );
        }

        String extension = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException(
                    "Unsupported image type"
            );
        };

        Files.createDirectories(uploadDirectory);

        String filename = UUID.randomUUID() + extension;
        Path destination = uploadDirectory.resolve(filename).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );

        return filename;
    }
}

