package com.example.pft;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.example.pft.config.TestcontainersConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
class PersonalFinanceTrackerApplicationTests {

	@Test
	@DisplayName("Should load Spring application context successfully with testcontainers")
	void contextLoads() {
		// This test verifies that the Spring application context initializes correctly
		// with all required beans and testcontainers configuration.
	}

}
