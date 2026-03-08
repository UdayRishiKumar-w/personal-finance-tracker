package com.example.pft.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.pft.entity.RefreshToken;
import com.example.pft.entity.User;
import com.example.pft.exception.UnauthorizedException;
import com.example.pft.repository.RefreshTokenRepository;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;
import com.example.pft.support.TestDataFactory;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

	@Mock
	private RefreshTokenRepository refreshTokenRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private UserService userService;

	@Mock
	private JwtTokenProvider tokenProvider;

	@InjectMocks
	private RefreshTokenService refreshTokenService;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(this.refreshTokenService, "refreshExpirationMs", 3600_000L);
		ReflectionTestUtils.setField(this.refreshTokenService, "sameSite", "Lax");
		ReflectionTestUtils.setField(this.refreshTokenService, "cookieSecure", true);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when creating token for non-existent user")
	void createOrUpdateRefreshToken_missingUser_throwsIllegalArgument() {
		when(this.userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.refreshTokenService.createOrUpdateRefreshToken("missing@example.com"))
			.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	@DisplayName("Should create and persist new refresh token when user has no existing token")
	void createOrUpdateRefreshToken_newToken_createsAndPersists() {
		final User user = TestDataFactory.createUser("ava@example.com");

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.tokenProvider.generateRefreshToken("ava@example.com")).thenReturn("refresh-token");
		when(this.userService.saveUser(user)).thenReturn(user);

		final RefreshToken result = this.refreshTokenService.createOrUpdateRefreshToken("ava@example.com");

		assertThat(result.getToken()).isEqualTo("refresh-token");
		assertThat(result.getExpiryDate()).isAfter(Instant.now());
		assertThat(user.getRefreshToken()).isEqualTo(result);
		verify(this.userService).saveUser(user);
	}

	@Test
	@DisplayName("Should update existing token with new token value and extended expiry")
	void createOrUpdateRefreshToken_existingToken_updatesTokenAndExpiry() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final RefreshToken existing =
			TestDataFactory.createRefreshToken(user, "old-token", Instant.now().minusSeconds(60));
		user.setRefreshToken(existing);

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.tokenProvider.generateRefreshToken("ava@example.com")).thenReturn("new-token");
		when(this.userService.saveUser(user)).thenReturn(user);

		final RefreshToken result = this.refreshTokenService.createOrUpdateRefreshToken("ava@example.com");

		assertThat(result).isSameAs(existing);
		assertThat(result.getToken()).isEqualTo("new-token");
		assertThat(result.getExpiryDate()).isAfter(Instant.now());
		verify(this.userService).saveUser(user);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when updating non-existent token")
	void updateRefreshToken_missingToken_throwsIllegalArgument() {
		when(this.refreshTokenRepository.findByToken("missing")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.refreshTokenService.updateRefreshToken("missing", "new"))
			.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	@DisplayName("Should update token value and extend expiry for valid token")
	void updateRefreshToken_validToken_updatesUserToken() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "old", Instant.now().minusSeconds(60));
		user.setRefreshToken(token);

		when(this.refreshTokenRepository.findByToken("old")).thenReturn(Optional.of(token));
		when(this.userService.saveUser(user)).thenReturn(user);

		this.refreshTokenService.updateRefreshToken("old", "new");

		assertThat(token.getToken()).isEqualTo("new");
		assertThat(token.getExpiryDate()).isAfter(Instant.now());
		verify(this.userService).saveUser(user);
	}

	@Test
	@DisplayName("Should throw UnauthorizedException when clearing non-existent token")
	void clearRefreshToken_missingToken_throwsUnauthorized() {
		when(this.refreshTokenRepository.findByToken("missing")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.refreshTokenService.clearRefreshToken(new MockHttpServletResponse(), "missing"))
			.isInstanceOf(UnauthorizedException.class);
	}

	@Test
	@DisplayName("Should clear user refresh token and set cookie headers on successful logout")
	void clearRefreshToken_validToken_clearsUserAndCookies() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "refresh", Instant.now().plusSeconds(600));
		user.setRefreshToken(token);
		final MockHttpServletResponse response = new MockHttpServletResponse();

		when(this.refreshTokenRepository.findByToken("refresh")).thenReturn(Optional.of(token));
		when(this.userService.saveUser(user)).thenReturn(user);

		final ResponseEntity<?> result = this.refreshTokenService.clearRefreshToken(response, "refresh");

		assertThat(result.getBody()).isEqualTo("Logged out successfully.");
		assertThat(user.getRefreshToken()).isNull();
		assertThat(response.getHeaders(HttpHeaders.SET_COOKIE)).hasSize(2);
		assertThat(response.getHeader("Clear-Site-Data")).contains("cookies");
		verify(this.userService).saveUser(user);
	}

	@Test
	@DisplayName("Should throw UnauthorizedException when validating non-existent token")
	void isValidRefreshToken_missingToken_throwsUnauthorized() {
		when(this.refreshTokenRepository.findByToken("missing")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.refreshTokenService.isValidRefreshToken("missing"))
			.isInstanceOf(UnauthorizedException.class);
	}

	@Test
	@DisplayName("Should throw UnauthorizedException and clear token when token is expired")
	void isValidRefreshToken_expiredToken_throwsUnauthorizedAndClears() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "refresh", Instant.now().minusSeconds(10));
		user.setRefreshToken(token);

		when(this.refreshTokenRepository.findByToken("refresh")).thenReturn(Optional.of(token));
		when(this.userService.saveUser(user)).thenReturn(user);

		assertThatThrownBy(() -> this.refreshTokenService.isValidRefreshToken("refresh"))
			.isInstanceOf(UnauthorizedException.class)
			.hasMessageContaining("expired");

		assertThat(user.getRefreshToken()).isNull();
		verify(this.userService).saveUser(user);
	}

	@Test
	@DisplayName("Should return true when refresh token exists and is not expired")
	void isValidRefreshToken_validToken_returnsTrue() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "refresh", Instant.now().plusSeconds(3600));

		when(this.refreshTokenRepository.findByToken("refresh")).thenReturn(Optional.of(token));

		assertThat(this.refreshTokenService.isValidRefreshToken("refresh")).isTrue();
		verifyNoMoreInteractions(this.userService);
	}
}
