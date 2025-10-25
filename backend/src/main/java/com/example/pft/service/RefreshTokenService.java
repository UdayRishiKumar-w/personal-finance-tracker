
package com.example.pft.service;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pft.entity.RefreshToken;
import com.example.pft.entity.User;
import com.example.pft.repository.RefreshTokenRepository;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
	@Value("${app.cookie.secure:true}")
	private boolean cookieSecure;
	@Value("${jwt.refresh-expiration}")
	private long refreshExpirationMs;

	private final RefreshTokenRepository refreshTokenRepository;
	private final UserRepository userRepository;
	private final UserService userService;
	private final JwtTokenProvider tokenProvider;

	@Transactional
	public RefreshToken createOrUpdateRefreshToken(final String email) {
		final User user = this.userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

		final String refreshJWTToken = this.tokenProvider.generateRefreshToken(email);
		RefreshToken refreshToken = user.getRefreshToken();

		if (refreshToken == null) {
			refreshToken = new RefreshToken();
			refreshToken.setUser(user);
		}

		refreshToken.setToken(refreshJWTToken);
		refreshToken.setExpiryDate(Instant.now().plusMillis(this.refreshExpirationMs));

		// Save both entities (cascade handles refreshToken)
		user.setRefreshToken(refreshToken);
		this.userService.saveUser(user);

		return refreshToken;
	}

	@Transactional
	public void updateRefreshToken(final String oldToken, final String newToken) {
		final RefreshToken refreshToken = this.refreshTokenRepository.findByToken(oldToken)
				.orElseThrow(() -> new IllegalArgumentException("Refresh token not found."));

		refreshToken.setToken(newToken);
		refreshToken.setExpiryDate(Instant.now().plusMillis(this.refreshExpirationMs));
		this.refreshTokenRepository.save(refreshToken);
	}

	public ResponseEntity<?> clearRefreshToken(final HttpServletResponse response, final String refreshToken) {
		return this.refreshTokenRepository.findByToken(refreshToken)
				.map(token -> {
					this.refreshTokenRepository.delete(token);
					this.clearAuthCookies(response);
					return ResponseEntity.ok("Logged out successfully.");
				})
				.orElse(ResponseEntity.badRequest().body("Invalid refresh token."));
	}

	@Transactional
	public boolean isValidRefreshToken(final String refreshToken) {
		final RefreshToken token = this.refreshTokenRepository.findByToken(refreshToken)
				.orElseThrow(() -> new RuntimeException("Invalid refresh token."));

		if (token.isExpired()) {
			this.refreshTokenRepository.delete(token);
			throw new RuntimeException("Refresh token expired. Please login again.");
		} // UnauthorizedException

		return true;
	}

	private void clearAuthCookies(final HttpServletResponse response) {
		final ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge(Duration.ZERO)
				.sameSite("Strict")
				.build();

		final ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(this.cookieSecure)
				.path("/")
				.maxAge(Duration.ZERO)
				.sameSite("Strict")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
		response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
	}
}
