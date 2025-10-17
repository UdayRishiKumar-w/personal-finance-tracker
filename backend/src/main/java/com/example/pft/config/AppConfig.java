package com.example.pft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.pft.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AppConfig {
	private final UserRepository userRepository;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(11);
	}

	// To expose AuthenticationManager for login handling
	@Bean
	protected AuthenticationManager authenticationManager(final AuthenticationConfiguration authConfig)
			throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public AuthenticationProvider authenticationProvider(final UserDetailsService userDetailsService) {
		final DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
		provider.setPasswordEncoder(this.passwordEncoder());
		return provider;
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return email -> this.userRepository.findByEmail(email)
				.map(u -> User
						.withUsername(u.getEmail())
						.password(u.getPassword())
						.roles(u.getRole().name().replace("ROLE_", ""))
						.build())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

}
