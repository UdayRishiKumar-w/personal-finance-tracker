package com.example.pft.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.LoginRequestDTO;
import com.example.pft.dto.SignUpRequestDTO;
import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;
import com.example.pft.enums.Role;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;
import com.example.pft.service.RefreshTokenService;
import com.example.pft.service.UserService;
import com.example.pft.util.Utils;

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
	@Value("${jwt.expiration}")
	private long jwtExpirationMs;
	@Value("${jwt.refresh-expiration}")
	private long refreshExpirationMs;

	private final UserRepository userRepository;
	private final RefreshTokenService refreshTokenService;
	private final UserService userService;
	private final JwtTokenProvider tokenProvider;
	private final PasswordEncoder passwordEncoder;
	private final UserMapper userMapper;
	private final AuthenticationManager authenticationManager;
	// private final AuthService service;

	@Value("${app.cookie.secure:true}")
	private boolean cookieSecure;

	@Transactional
	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody final SignUpRequestDTO request,
			final HttpServletResponse response) {
		// Check if user already exists
		if (this.userRepository.existsByEmail(request.email())) {
			return ResponseEntity.status(409).body(Map.of("message", "User already exists"));
		}

		final User newUser = this.userMapper.toEntity(request);
		newUser.setPassword(this.passwordEncoder.encode(request.password()));
		newUser.setRole(Role.USER);
		this.userService.saveUser(newUser);

		final String accessToken = this.tokenProvider.generateAccessToken(newUser.getEmail());
		final String refreshToken = this.refreshTokenService.createOrUpdateRefreshToken(newUser.getEmail()).getToken();

		this.setAuthCookies(response, accessToken, refreshToken);
		return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken, "user",
				Map.of("id", newUser.getId(), "email", newUser.getEmail())));
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody final LoginRequestDTO request,
			final HttpServletResponse response) {
		final Authentication authentication = this.authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.email(), request.password()));
		final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		final UserDTO user = this.userService.getUser(userDetails.getUsername());

		final String accessToken = this.tokenProvider.generateAccessToken(user.getEmail());
		final String refreshToken = this.refreshTokenService.createOrUpdateRefreshToken(user.getEmail()).getToken();
		this.setAuthCookies(response, accessToken, refreshToken);

		return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken, "user",
				Map.of("email", user.getEmail())));
	}

	@PostMapping("/refresh")
	public ResponseEntity<Map<String, Object>> refresh(final HttpServletRequest request,
			final HttpServletResponse response) {
		final String refreshToken = this.getRefreshTokenFromCookie(request);

		if (!Utils.isNotNullOrBlank(refreshToken)) {
			return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required."));
		}

		if (!this.refreshTokenService.isValidRefreshToken(refreshToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Invalid refresh token."));
		}

		final String email = this.tokenProvider.getUsernameFromToken(refreshToken);

		final String newAccessToken = this.tokenProvider.generateAccessToken(email);
		final String newRefreshToken = this.tokenProvider.generateRefreshToken(email);
		this.refreshTokenService.updateRefreshToken(refreshToken, newRefreshToken);
		this.setAuthCookies(response, newAccessToken, newRefreshToken);

		return ResponseEntity.ok(Map.of("message", "Token refreshed", "accessToken", newAccessToken,
				"refreshToken", newRefreshToken));

	}

	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser(final HttpServletRequest request, final HttpServletResponse response) {
		final String refreshToken = this.getRefreshTokenFromCookie(request);

		if (!Utils.isNotNullOrBlank(refreshToken)) {
			return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required."));
		}

		return this.refreshTokenService.clearRefreshToken(response, refreshToken);
	}

	private void setAuthCookies(final HttpServletResponse response, final String accessToken,
			final String refreshToken) {
		final ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge((int) this.jwtExpirationMs / 1000)
				.sameSite("Strict")
				.build();

		final ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge((int) this.refreshExpirationMs / 1000)
				.sameSite("Strict")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
	}

	private String getRefreshTokenFromCookie(final HttpServletRequest request) {
		if (request.getCookies() == null)
			return null;
		for (final Cookie cookie : request.getCookies()) {
			if ("refreshToken".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}
}
