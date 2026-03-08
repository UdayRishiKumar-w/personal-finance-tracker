package com.example.pft.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.pft.dto.PaginatedResponse;
import com.example.pft.dto.TransactionDTO;
import com.example.pft.entity.User;
import com.example.pft.exception.GlobalExceptionHandler;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;
import com.example.pft.service.TransactionService;
import com.example.pft.support.TestDataFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(TransactionController.class)
@Import(GlobalExceptionHandler.class)
class TransactionControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private TransactionService transactionService;

	@MockitoBean
	private UserRepository userRepository;

	@MockitoBean
	private JwtTokenProvider jwtTokenProvider;

	@Test
	@DisplayName("Should create transaction and return created response with transaction data")
	void create_validRequest_returnsCreatedTransaction() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		user.setId(1L);
		final TransactionDTO dto = TestDataFactory.createTransactionDto();
		dto.setId(42L);

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.transactionService.createTransaction(eq(user), any(TransactionDTO.class))).thenReturn(dto);

		this.mockMvc
			.perform(
				post("/api/transactions")
					.with(csrf())
					.with(user("ava@example.com"))
					.contentType("application/json")
					.content(this.objectMapper.writeValueAsString(TestDataFactory.createTransactionDto()))
			)
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").value(42L))
			.andExpect(jsonPath("$.title").value("Salary"));

		verify(this.transactionService).createTransaction(eq(user), any(TransactionDTO.class));
	}

	@Test
	@DisplayName("Should return unauthorized when creating transaction without authentication")
	void create_missingAuthentication_returnsUnauthorized() throws Exception {
		this.mockMvc
			.perform(
				post("/api/transactions")
					.with(csrf())
					.contentType("application/json")
					.content(this.objectMapper.writeValueAsString(TestDataFactory.createTransactionDto()))
			)
			.andExpect(status().isUnauthorized());

		verifyNoInteractions(this.transactionService);
	}

	@Test
	@DisplayName("Should return bad request when creating transaction with invalid body")
	void create_invalidBody_returnsBadRequest() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));

		this.mockMvc
			.perform(
				post("/api/transactions")
					.with(csrf())
					.with(user("ava@example.com"))
					.contentType("application/json")
					.content("{}")
			)
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.errors").isArray())
			.andExpect(jsonPath("$.errors", Matchers.hasItem(containsString("title"))));

		verifyNoInteractions(this.transactionService);
	}

	@Test
	@DisplayName("Should return not found when creating transaction for non-existent user")
	void create_userNotFound_returnsNotFound() throws Exception {
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.empty());

		this.mockMvc
			.perform(
				post("/api/transactions")
					.with(csrf())
					.with(user("ava@example.com"))
					.contentType("application/json")
					.content(this.objectMapper.writeValueAsString(TestDataFactory.createTransactionDto()))
			)
			.andExpect(status().isNotFound());

		verifyNoInteractions(this.transactionService);
	}

	@Test
	@DisplayName("Should update transaction and return updated transaction data")
	void update_validRequest_returnsUpdatedTransaction() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		final TransactionDTO dto = TestDataFactory.createTransactionDto();
		dto.setId(12L);
		dto.setAmount(new BigDecimal("99.99"));

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.transactionService.updateTransaction(eq(user), eq(12L), any(TransactionDTO.class))).thenReturn(dto);

		this.mockMvc
			.perform(
				put("/api/transactions/12")
					.with(csrf())
					.with(user("ava@example.com"))
					.contentType("application/json")
					.content(this.objectMapper.writeValueAsString(dto))
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(12L))
			.andExpect(jsonPath("$.amount").value(99.99));

		verify(this.transactionService).updateTransaction(eq(user), eq(12L), any(TransactionDTO.class));
	}

	@Test
	@DisplayName("Should delete transaction and return no content response")
	void delete_validRequest_returnsNoContent() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));

		this.mockMvc
			.perform(delete("/api/transactions/9").with(csrf()).with(user("ava@example.com")))
			.andExpect(status().isNoContent());

		verify(this.transactionService).deleteTransaction(user, 9L);
	}

	@Test
	@DisplayName("Should return paginated transaction list with valid request parameters")
	void list_validRequest_returnsPaginatedResponse() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		final TransactionDTO dto = TestDataFactory.createTransactionDto();
		dto.setId(7L);
		final PaginatedResponse<TransactionDTO> response =
			new PaginatedResponse<>(List.of(dto), 1, 1, 0, 20);

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.transactionService.transactionsList(user, 0, 20, "date", "DESC")).thenReturn(response);

		this.mockMvc
			.perform(
				get("/api/transactions")
					.with(user("ava@example.com"))
					.param("page", "0")
					.param("size", "20")
					.param("sortBy", "date")
					.param("sortDir", "DESC")
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[0].id").value(7L))
			.andExpect(jsonPath("$.totalElements").value(1))
			.andExpect(jsonPath("$.totalPages").value(1));

		verify(this.transactionService).transactionsList(user, 0, 20, "date", "DESC");
	}

	@Test
	@DisplayName("Should return bad request when date range has invalid order (from after to)")
	void range_invalidDates_returnsBadRequest() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));

		this.mockMvc
			.perform(
				get("/api/transactions/range")
					.with(user("ava@example.com"))
					.param("from", "2025-05-10")
					.param("to", "2025-05-01")
			)
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(containsString("From date must be before")));

		verifyNoMoreInteractions(this.transactionService);
	}

	@Test
	@DisplayName("Should return bad request when date range exceeds 365 days limit")
	void range_tooLarge_returnsBadRequest() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));

		this.mockMvc
			.perform(
				get("/api/transactions/range")
					.with(user("ava@example.com"))
					.param("from", "2024-01-01")
					.param("to", "2025-06-01")
			)
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value(containsString("cannot exceed 365 days")));

		verifyNoMoreInteractions(this.transactionService);
	}

	@Test
	@DisplayName("Should return transactions within valid date range")
	void range_validRequest_returnsTransactions() throws Exception {
		final User user = TestDataFactory.createUser("ava@example.com");
		final TransactionDTO dto = TestDataFactory.createTransactionDto();

		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));
		when(this.transactionService.fetchTransactionsBetween(eq(user), any(LocalDate.class), any(LocalDate.class)))
			.thenReturn(List.of(dto));

		this.mockMvc
			.perform(
				get("/api/transactions/range")
					.with(user("ava@example.com"))
					.param("from", "2025-01-01")
					.param("to", "2025-01-31")
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].title").value("Salary"));

		verify(this.transactionService).fetchTransactionsBetween(eq(user), any(LocalDate.class), any(LocalDate.class));
	}
}
