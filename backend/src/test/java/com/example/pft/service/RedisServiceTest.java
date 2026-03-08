package com.example.pft.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import com.example.pft.exception.InvalidateException;

@ExtendWith(MockitoExtension.class)
class RedisServiceTest {

	@Mock
	private RedisTemplate<String, Object> redisTemplate;

	@Mock
	private ValueOperations<String, Object> valueOperations;

	@InjectMocks
	private RedisService redisService;

	@Test
	@DisplayName("Should save value with TTL in minutes when valid TTL is provided")
	void save_validTtl_savesValue() {
		when(this.redisTemplate.opsForValue()).thenReturn(this.valueOperations);

		this.redisService.save("key", "value", 5);

		verify(this.valueOperations).set("key", "value", 5, TimeUnit.MINUTES);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when TTL is zero or negative")
	void save_nonPositiveTtl_throwsIllegalArgument() {
		assertThatThrownBy(() -> this.redisService.save("key", "value", 0))
			.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	@DisplayName("Should throw InvalidateException when DataAccessException occurs during save")
	void save_dataAccessException_throwsInvalidate() {
		when(this.redisTemplate.opsForValue()).thenReturn(this.valueOperations);
		doThrow(new DataAccessException("fail") {
		}).when(this.valueOperations).set("key", "value", 5, TimeUnit.MINUTES);

		assertThatThrownBy(() -> this.redisService.save("key", "value", 5))
			.isInstanceOf(InvalidateException.class);
	}

	@Test
	@DisplayName("Should throw InvalidateException when DataAccessException occurs during get")
	void get_dataAccessException_throwsInvalidate() {
		when(this.redisTemplate.opsForValue()).thenReturn(this.valueOperations);
		when(this.valueOperations.get("key")).thenThrow(new DataAccessException("fail") {
		});

		assertThatThrownBy(() -> this.redisService.get("key"))
			.isInstanceOf(InvalidateException.class);
	}

	@Test
	@DisplayName("Should throw InvalidateException when DataAccessException occurs during delete")
	void delete_dataAccessException_throwsInvalidate() {
		when(this.redisTemplate.delete("key")).thenThrow(new DataAccessException("fail") {
		});

		assertThatThrownBy(() -> this.redisService.delete("key"))
			.isInstanceOf(InvalidateException.class);
	}

	@ParameterizedTest(name = "Should throw IllegalArgumentException when pattern is null or empty - {index}")
	@NullAndEmptySource
	void evictByPattern_invalidPattern_throwsIllegalArgument(final String pattern) {
		assertThatThrownBy(() -> this.redisService.evictByPattern(pattern))
			.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	@DisplayName("Should throw InvalidateException when DataAccessException occurs during pattern eviction")
	void evictByPattern_dataAccessException_throwsInvalidate() {
		when(this.redisTemplate.execute(any(RedisCallback.class)))
			.thenThrow(new DataAccessException("fail") {
			});

		assertThatThrownBy(() -> this.redisService.evictByPattern("transactions*"))
			.isInstanceOf(InvalidateException.class);
	}

	@Test
	@DisplayName("Should execute Redis callback when valid pattern is provided for eviction")
	void evictByPattern_validPattern_executesCallback() {
		when(this.redisTemplate.execute(any(RedisCallback.class))).thenReturn(null);

		this.redisService.evictByPattern("transactions*");

		verify(this.redisTemplate).execute(any(RedisCallback.class));
	}
}
