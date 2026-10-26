
package com.ccl.civicconnect.config;

import com.ccl.civicconnect.entity.User;
import com.ccl.civicconnect.repository.UserRepository;
import com.ccl.civicconnect.security.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            String email = "admin@civicconnect.in";

            if (!userRepository.existsByEmail(email)) {
                User admin = new User();

                admin.setName("Government Administrator");
                admin.setEmail(email);
                admin.setPassword(
                        passwordEncoder.encode("12345678")
                );
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("Admin account created successfully!");
            }
        };
    }
}

