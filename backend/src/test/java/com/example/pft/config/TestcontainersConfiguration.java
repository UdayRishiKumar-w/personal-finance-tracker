package com.example.pft.config;

import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

	/*
	@Bean(initMethod = "start", destroyMethod = "stop")
	@ServiceConnection(name = "redis")
	public GenericContainer<?> redisContainer() {
		return new GenericContainer<>(DockerImageName.parse("redis:8.2.1-alpine")).withExposedPorts(6379);
	}
	*/
}
