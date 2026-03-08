package com.example.pft.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.example.pft.entity.RefreshToken;
import com.example.pft.entity.User;
import com.example.pft.support.TestDataFactory;

@DataJpaTest
class RefreshTokenRepositoryTest {

	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestEntityManager entityManager;

	@Test
	@DisplayName("Should find refresh token when token exists in database")
	void findByToken_existingToken_returnsToken() {
		final User user = this.userRepository.save(TestDataFactory.createUser("ava@example.com"));
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "refresh-token", Instant.now().plusSeconds(3600));
		user.setRefreshToken(token);
		this.userRepository.save(user);
		this.entityManager.flush();

		assertThat(this.refreshTokenRepository.findByToken("refresh-token"))
			.isPresent()
			.get()
			.extracting(RefreshToken::getToken)
			.isEqualTo("refresh-token");
	}

	@Test
	@DisplayName("Should find refresh token by user email when token exists")
	void findByUserEmail_existingToken_returnsToken() {
		final User user = this.userRepository.save(TestDataFactory.createUser("ava@example.com"));
		final RefreshToken token =
			TestDataFactory.createRefreshToken(user, "refresh-token", Instant.now().plusSeconds(3600));
		user.setRefreshToken(token);
		this.userRepository.save(user);
		this.entityManager.flush();

		assertThat(this.refreshTokenRepository.findByUserEmail("ava@example.com"))
			.isPresent()
			.get()
			.extracting(RefreshToken::getToken)
			.isEqualTo("refresh-token");
	}
}
