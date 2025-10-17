package com.example.pft.service;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// https://medium.com/@dulanjayasandaruwan1998/redis-spring-boot-a-powerful-combination-for-high-performance-applications-c0285efc0b25
@RequiredArgsConstructor
@Slf4j
@Service
public class RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	public void saveData(String key, Object value) {
		try {
			this.redisTemplate.opsForValue().set(key, value);
		} catch (DataAccessException e) {
			log.warn("redis - exception, {}", e);
			throw new RuntimeException("Failed to save data to Redis for key: " + key, e);
		}
	}

	public Object getData(String key) {
		return this.redisTemplate.opsForValue().get(key);
	}

	public void deleteData(String key) {
		this.redisTemplate.delete(key);
	}
}
