package com.example.pft.service;

import java.util.concurrent.TimeUnit;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// https://medium.com/@dulanjayasandaruwan1998/redis-spring-boot-a-powerful-combination-for-high-performance-applications-c0285efc0b25
@RequiredArgsConstructor
@Slf4j
@Service
public class RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	public void save(final String key, final Object value, final long ttlMinutes) {
		if (ttlMinutes <= 0) {
			throw new IllegalArgumentException("TTL must be positive, got: " + ttlMinutes);
		}
		try {
			this.redisTemplate.opsForValue().set(key, value, ttlMinutes, TimeUnit.MINUTES);
		} catch (final DataAccessException e) {
			log.error("Failed to save data to Redis for key {}: {}", key, e.getMessage());
			throw new RuntimeException("Redis save failed", e);
		}
	}

	public Object get(final String key) {
		try {
			return this.redisTemplate.opsForValue().get(key);
		} catch (final DataAccessException e) {
			log.error("Failed to get data from Redis for key {}: {}", key, e.getMessage());
			throw new RuntimeException("Redis get failed", e);
		}
	}

	public void delete(@NonNull final String key) {
		try {
			this.redisTemplate.delete(key);
		} catch (final DataAccessException e) {
			log.error("Failed to delete data from Redis for key {}: {}", key, e.getMessage());
			throw new RuntimeException("Redis delete failed", e);
		}
	}

	public void evictByPattern(final String pattern) {
		if (pattern == null || pattern.isEmpty()) {
			throw new IllegalArgumentException("Pattern must not be null or empty");
		}

		try {
			this.redisTemplate.execute((RedisCallback<Void>) connection -> {
				final ScanOptions options = ScanOptions.scanOptions().match(pattern).count(100).build();
				try (final Cursor<byte[]> cursor = connection.keyCommands().scan(options)) {
					while (cursor.hasNext()) {
						connection.keyCommands().del(cursor.next());
					}
				} catch (final Exception e) {
					log.error("Error scanning or deleting keys for pattern: {}", pattern, e);
				}
				return null;
			});
		} catch (final DataAccessException e) {
			log.error("Failed to evict keys by pattern {} from Redis: {}", pattern, e.getMessage());
			throw new RuntimeException("Redis evictByPattern failed", e);
		}
	}
}
