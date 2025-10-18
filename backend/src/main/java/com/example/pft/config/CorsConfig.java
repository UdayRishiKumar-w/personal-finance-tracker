package com.example.pft.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
	@Value("${cors.allowed-origins}")
	protected String allowedOrigins;

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		final CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.setAllowedOrigins(List.of(allowedOrigins.split(",")));
		corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		// corsConfig.setExposedHeaders(List.of("Authorization"));
		// corsConfig.setAllowedHeaders(List.of("Content-Type", "Authorization","X-Requested-With"));
		corsConfig.setAllowedHeaders(List.of("*"));
		corsConfig.setAllowCredentials(true);
		corsConfig.setMaxAge(3600L);

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig); // Register CORS for all endpoints
		return source;
	}
}
