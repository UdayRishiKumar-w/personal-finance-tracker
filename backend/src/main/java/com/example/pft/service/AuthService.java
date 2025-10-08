package com.example.pft.service;

import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pft.dto.AuthResponseDTO;
import com.example.pft.dto.LoginRequestDTO;
import com.example.pft.dto.SignUpRequestDTO;
import com.example.pft.entity.User;
import com.example.pft.enums.Role;
import com.example.pft.exception.InvalidateException;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	@Transactional
	public AuthResponseDTO signup(final SignUpRequestDTO request) {
		if (this.userRepository.findByEmail(request.email()).isPresent()) {
			throw new InvalidateException("Email already registered");
		}

		final User user = User.builder()
				.firstName(request.firstName())
				.lastName(request.lastName())
				.email(request.email())
				.password(this.passwordEncoder.encode(request.password()))
				.role(Role.ROLE_USER)
				.createdAt(Instant.now().toEpochMilli())
				.build();
		final User savedUser = this.userRepository.save(user);

		final String token = this.jwtTokenProvider.generateAccessToken(savedUser.getEmail());
		final String refresh = this.jwtTokenProvider.generateRefreshToken(savedUser.getEmail());
		return AuthResponseDTO.builder().accessToken(token).refreshToken(refresh).build();
	}

	@Transactional(readOnly = true)
	public AuthResponseDTO login(final LoginRequestDTO request) {
		final User user = this.userRepository.findByEmail(request.email())
				.orElseThrow(() -> new InvalidateException("Invalid email or password"));

		if (!this.passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidateException("Invalid email or password");
		}
		final String token = this.jwtTokenProvider.generateAccessToken(user.getEmail());
		final String refresh = this.jwtTokenProvider.generateRefreshToken(user.getEmail());
		return AuthResponseDTO.builder().accessToken(token).refreshToken(refresh).build();
	}
}
