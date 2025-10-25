package com.example.pft.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.example.pft.util.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableRedisRepositories
@EnableCaching
public class RedisConfig {

	@Value("${spring.data.redis.host:localhost}")
	private String redisHost;
	@Value("${spring.data.redis.port:6379}")
	private int redisPort;
	@Value("${spring.data.redis.password:}")
	private String redisPassword;
	@Value("${spring.data.redis.database:0}")
	private int redisDatabase;

	private final ObjectMapper redisObjectMapper;

	public RedisConfig(@Qualifier("redisObjectMapper") final ObjectMapper redisObjectMapper) {
		this.redisObjectMapper = redisObjectMapper;
	}

	@Bean
	public LettuceConnectionFactory redisConnectionFactory() {
		final RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(this.redisHost, this.redisPort);
		if (Utils.isNotNullOrEmpty(this.redisPassword)) {
			config.setPassword(this.redisPassword);
		}
		config.setDatabase(this.redisDatabase);
		return new LettuceConnectionFactory(config);
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate(final RedisConnectionFactory connectionFactory) {
		final RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer(this.redisObjectMapper));
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer(this.redisObjectMapper));
		template.setEnableTransactionSupport(true);
		template.afterPropertiesSet();
		return template;
	}

	// https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html
	// https://www.baeldung.com/spring-boot-redis-cache
	@Bean
	public RedisCacheConfiguration cacheConfiguration() {
		return RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(Duration.ofMinutes(10)) // Set TTL to 10 minutes
				.enableTimeToIdle()
				.disableCachingNullValues()
				.serializeKeysWith(SerializationPair.fromSerializer(new StringRedisSerializer()))
				.serializeValuesWith(SerializationPair
						.fromSerializer(new GenericJackson2JsonRedisSerializer(this.redisObjectMapper)));
	}

	@Bean
	public CacheManager cacheManager(final RedisConnectionFactory redisConnectionFactory) {
		final RedisCacheConfiguration config = this.cacheConfiguration();
		return RedisCacheManager.builder(redisConnectionFactory)
				.cacheDefaults(config)
				.transactionAware()
				.build();
	}

}
