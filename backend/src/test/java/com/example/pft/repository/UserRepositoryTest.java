package com.example.pft.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import com.example.pft.entity.User;
import com.example.pft.support.TestDataFactory;

@DataJpaTest
class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestEntityManager entityManager;

	@Test
	@DisplayName("Should find user by email when user exists in database")
	void findByEmail_existingUser_returnsUser() {
		final User user = TestDataFactory.createUser("ava@example.com");
		this.entityManager.persistAndFlush(user);

		assertThat(this.userRepository.findByEmail("ava@example.com")).contains(user);
	}

	@Test
	@DisplayName("Should return true when checking existence of email that is registered")
	void existsByEmail_existingUser_returnsTrue() {
		final User user = TestDataFactory.createUser("ava@example.com");
		this.entityManager.persistAndFlush(user);

		assertThat(this.userRepository.existsByEmail("ava@example.com")).isTrue();
	}

	@Test
	@DisplayName("Should throw DataIntegrityViolationException when saving duplicate email")
	void save_duplicateEmail_throwsDataIntegrityViolation() {
		final User first = TestDataFactory.createUser("dup@example.com");
		final User second = TestDataFactory.createUser("dup@example.com");

		this.entityManager.persistAndFlush(first);

		assertThatThrownBy(() -> this.userRepository.saveAndFlush(second))
			.isInstanceOf(DataIntegrityViolationException.class);
	}
}
