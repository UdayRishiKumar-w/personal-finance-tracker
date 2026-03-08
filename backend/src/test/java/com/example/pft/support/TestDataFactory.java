package com.example.pft.support;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.example.pft.dto.TransactionDTO;
import com.example.pft.dto.UserDTO;
import com.example.pft.entity.RefreshToken;
import com.example.pft.entity.Transaction;
import com.example.pft.entity.User;
import com.example.pft.enums.Role;
import com.example.pft.enums.TransactionType;

public final class TestDataFactory {
	private TestDataFactory() {
	}

	public static User createUser(final String email) {
		return User
			.builder()
			.email(email)
			.firstName("Ava")
			.lastName("Nguyen")
			.password("Password1!")
			.role(Role.USER)
			.build();
	}

	public static UserDTO createUserDto(final String email) {
		final UserDTO dto = new UserDTO();
		dto.setEmail(email);
		dto.setFirstName("Ava");
		dto.setLastName("Nguyen");
		dto.setRole("USER");
		dto.setId("1");
		return dto;
	}

	public static Transaction createTransaction(final User user, final LocalDate date, final BigDecimal amount) {
		final Transaction transaction = new Transaction();
		transaction.setTitle("Groceries");
		transaction.setAmount(amount);
		transaction.setCategory("Food");
		transaction.setDate(date);
		transaction.setType(TransactionType.EXPENSE);
		transaction.setDescription("Weekly spend");
		transaction.setRecurring(false);
		transaction.setUser(user);
		return transaction;
	}

	public static TransactionDTO createTransactionDto() {
		final TransactionDTO dto = new TransactionDTO();
		dto.setTitle("Salary");
		dto.setAmount(new BigDecimal("1200.00"));
		dto.setCategory("Income");
		dto.setDate(LocalDate.of(2025, 1, 15));
		dto.setType(TransactionType.INCOME);
		dto.setDescription("Monthly salary");
		dto.setRecurring(false);
		return dto;
	}

	public static RefreshToken createRefreshToken(final User user, final String token, final Instant expiry) {
		final RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUser(user);
		refreshToken.setToken(token);
		refreshToken.setExpiryDate(expiry);
		return refreshToken;
	}
}
