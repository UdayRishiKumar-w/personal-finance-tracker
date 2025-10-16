package com.example.pft.config;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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

	private final WebConfig webConfig;

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		final CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.setAllowedOrigins(List.of(this.webConfig.allowedOrigins));
		corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		corsConfig.setAllowedHeaders(List.of("*"));
		corsConfig.setAllowCredentials(true);

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig); // Register CORS for all endpoints
		return source;
	}

	// https://stackoverflow.com/questions/77266685/spring-security-6-cors-is-deprecated-and-marked-for-removal
	@Bean
	protected SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
		return http
				.csrf(CsrfConfigurer::disable)
				.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer
						.configurationSource(this.corsConfigurationSource()))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(this.publicURLs.isEmpty()
								? new String[0]
								: this.publicURLs.split(","))
						.permitAll()
						.requestMatchers("/api/admin/**", "/api/users/admin").hasRole("ADMIN")
						.anyRequest().authenticated())
				.headers(headers -> headers.frameOptions(FrameOptionsConfig::disable))
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no session, stateless API
				)
				.authenticationProvider(this.authenticationProvider)
				.addFilterBefore(this.jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
}
