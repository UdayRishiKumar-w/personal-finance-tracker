package com.example.pft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())

				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/api/auth/**").permitAll() // allow auth endpoints
						.anyRequest().permitAll() // allow all requests
				)
				.headers(headers -> headers.frameOptions(frame -> frame.disable()))
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no session, stateless API
				);

		// Add your JWT filter here (before UsernamePasswordAuthenticationFilter), e.g.
		// http.addFilterBefore(jwtAuthenticationFilter(),
		// UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// To expose AuthenticationManager for login handling
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}
}
