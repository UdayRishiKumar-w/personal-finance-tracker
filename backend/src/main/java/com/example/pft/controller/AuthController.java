package com.example.pft.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.LoginRequestDTO;
import com.example.pft.dto.SignUpRequestDTO;
import com.example.pft.entity.User;
import com.example.pft.enums.Role;
import com.example.pft.exception.InvalidateException;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserRepository userRepository;
	private final JwtTokenProvider tokenProvider;
	private final PasswordEncoder passwordEncoder;
	private final UserMapper userMapper;
	// private final AuthService service;

	@Value("${app.cookie.secure:true}")
	private boolean cookieSecure;

	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody final SignUpRequestDTO request,
			final HttpServletResponse response) {
		// Check if user already exists
		final Optional<User> userOpt = this.userRepository.findByEmail(request.email());
		if (userOpt.isPresent()) {
			return ResponseEntity.status(409).body(Map.of("message", "User already exists"));
		}

		final User newUser = this.userMapper.toEntity(request);
		newUser.setPassword(this.passwordEncoder.encode(request.password()));
		newUser.setRole(Role.ROLE_USER);
		this.userRepository.save(newUser);

		final String accessToken = this.tokenProvider.generateAccessToken(newUser.getEmail());
		final String refreshToken = this.tokenProvider.generateRefreshToken(newUser.getEmail());

		this.setAuthCookies(response, accessToken, refreshToken);
		return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken, "user",
				Map.of("id", newUser.getId(), "email", newUser.getEmail())));
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody final LoginRequestDTO request,
			final HttpServletResponse response) {
		final Optional<User> userOpt = this.userRepository.findByEmail(request.email());

		if (userOpt.isEmpty()) {
			throw new InvalidateException("Invalid credentials");
		}

		final User user = userOpt.get();

		if (!this.passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidateException("Invalid credentials");
		}

		final String accessToken = this.tokenProvider.generateAccessToken(user.getEmail());
		final String refreshToken = this.tokenProvider.generateRefreshToken(user.getEmail());
		this.setAuthCookies(response, accessToken, refreshToken);

		return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken, "user",
				Map.of("id", user.getId(), "email", user.getEmail())));
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(final HttpServletRequest request, final HttpServletResponse response) {
		String refreshToken = null;
		if (request.getCookies() != null) {
			for (final Cookie cookie : request.getCookies()) {
				if ("refreshToken".equals(cookie.getName())) {
					refreshToken = cookie.getValue();
				}
			}
		}

		if (refreshToken == null || !this.tokenProvider.validateJwtToken(refreshToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
		}

		final String email = this.tokenProvider.getUsernameFromToken(refreshToken);

		final String newAccessToken = this.tokenProvider.generateAccessToken(email);
		final String newRefreshToken = this.tokenProvider.generateRefreshToken(email);

		this.setAuthCookies(response, newAccessToken, newRefreshToken);

		return ResponseEntity.ok(Map.of("message", "Token refreshed"));
	}

	private void setAuthCookies(final HttpServletResponse response, final String accessToken,
			final String refreshToken) {
		final ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge(60 * 60) // 1 hour
				.sameSite("Strict")
				.build();

		final ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge(7 * 24 * 60 * 60) // 7 days
				.sameSite("Strict")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
	}
}
