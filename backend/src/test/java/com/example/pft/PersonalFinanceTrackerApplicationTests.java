package com.example.pft;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.example.pft.config.TestcontainersConfiguration;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
class PersonalFinanceTrackerApplicationTests {

	@Test
	void contextLoads() {
		// This test ensures that the Spring application context loads successfully.
	}

}
