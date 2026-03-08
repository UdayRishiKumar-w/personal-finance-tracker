package com.example.pft.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.example.pft.entity.Transaction;
import com.example.pft.entity.User;
import com.example.pft.support.TestDataFactory;

@DataJpaTest
class TransactionRepositoryTest {

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestEntityManager entityManager;

	@Test
	@DisplayName("Should return paginated transactions sorted by date descending for user")
	void findByUserId_returnsPagedTransactions() {
		final User user = this.userRepository.save(TestDataFactory.createUser("ava@example.com"));
		final Transaction first =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 1, 2), new BigDecimal("12.00"));
		final Transaction second =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 1, 1), new BigDecimal("15.00"));
		this.transactionRepository.saveAll(List.of(first, second));
		this.entityManager.flush();

		final Page<Transaction> page = this.transactionRepository.findByUserId(
			user.getId(),
			PageRequest.of(0, 10, Sort.by("date").descending())
		);

		assertThat(page.getContent()).hasSize(2);
	}

	@Test
	@DisplayName("Should return transactions ordered by date ascending within date range")
	void findByUserIdAndDateBetweenOrderByDateAsc_returnsOrdered() {
		final User user = this.userRepository.save(TestDataFactory.createUser("ava@example.com"));
		final Transaction jan =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 1, 5), new BigDecimal("10.00"));
		final Transaction feb =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 2, 1), new BigDecimal("20.00"));
		this.transactionRepository.saveAll(List.of(feb, jan));
		this.entityManager.flush();

		final List<Transaction> result = this.transactionRepository.findByUserIdAndDateBetweenOrderByDateAsc(
			user.getId(),
			LocalDate.of(2025, 1, 1),
			LocalDate.of(2025, 2, 15)
		);

		assertThat(result).hasSize(2);
		assertThat(result.get(0).getDate()).isBefore(result.get(1).getDate());
	}

	@Test
	@DisplayName("Should return correct count of transactions for user")
	void countByUserId_returnsCount() {
		final User user = this.userRepository.save(TestDataFactory.createUser("ava@example.com"));
		final Transaction first =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 1, 2), new BigDecimal("12.00"));
		final Transaction second =
			TestDataFactory.createTransaction(user, LocalDate.of(2025, 1, 3), new BigDecimal("15.00"));
		this.transactionRepository.saveAll(List.of(first, second));
		this.entityManager.flush();

		assertThat(this.transactionRepository.countByUserId(user.getId())).isEqualTo(2);
	}
}
