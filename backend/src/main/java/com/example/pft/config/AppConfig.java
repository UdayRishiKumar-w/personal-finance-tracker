package com.example.pft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.pft.service.UserService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AppConfig {
	private final UserService userService;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(11);
	}

	// To expose AuthenticationManager for login handling
	@Bean
	public AuthenticationManager authManager(final HttpSecurity http) throws Exception {
		return http
			.getSharedObject(AuthenticationManagerBuilder.class)
			.authenticationProvider(this.authenticationProvider())
			.build();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		final DaoAuthenticationProvider provider = new DaoAuthenticationProvider(this.userDetailsService());
		provider.setPasswordEncoder(this.passwordEncoder());
		return provider;
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return email -> {
			final com.example.pft.entity.User u = this.userService.loadUserByEmail(email);
			return User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole().name()).build();
		};
	}

}
