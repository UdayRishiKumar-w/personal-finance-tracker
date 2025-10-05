package com.example.pft.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.GenericContainer;

@TestConfiguration
public class RedisTestConfig {

	@Bean(initMethod = "start", destroyMethod = "stop")
	public GenericContainer<?> redisContainer() {
		try (GenericContainer<?> redis = new GenericContainer<>("redis:8.2.1-alpine").withExposedPorts(6379)) {
			return redis;
		}
	}
}
