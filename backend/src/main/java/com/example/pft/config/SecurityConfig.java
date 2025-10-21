package com.example.pft.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.pft.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize, @RolesAllowed
@RequiredArgsConstructor
public class SecurityConfig {

	@Value("${app.security.public-urls:}")
	private String publicURLs;

	private final JwtAuthenticationFilter jwtFilter;
	private final AuthenticationProvider authenticationProvider;
	private final CorsConfigurationSource corsConfigurationSource;

	// https://stackoverflow.com/questions/77266685/spring-security-6-cors-is-deprecated-and-marked-for-removal
	@Bean
	protected SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
		return http
				.csrf(CsrfConfigurer::disable)
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(this.publicURLs.isEmpty()
								? new String[0]
								: this.publicURLs.split(","))
						.permitAll()
						.requestMatchers("/api/admin/**", "/api/users/admin").hasRole("ADMIN")
						.anyRequest().authenticated())
				.headers(headers -> headers.frameOptions(FrameOptionsConfig::disable))
				// no session, stateless API
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(this.authenticationProvider)
				.addFilterBefore(this.jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
}
