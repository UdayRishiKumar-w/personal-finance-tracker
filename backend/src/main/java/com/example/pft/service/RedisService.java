package com.example.pft.service;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RedisService {

	private RedisTemplate<String, Object> redisTemplate;

	public RedisService(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	public void saveData(String key, Object value) {
		try {
			redisTemplate.opsForValue().set(key, value);
		} catch (DataAccessException e) {
			log.warn("redis - exception, {}", e);
			throw new RuntimeException("Failed to save data to Redis for key: " + key, e);
		}
	}

	public Object getData(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	public void deleteData(String key) {
		redisTemplate.delete(key);
	}
}
