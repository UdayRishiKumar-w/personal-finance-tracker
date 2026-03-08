package com.example.pft.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;

import com.example.pft.dto.PaginatedResponse;
import com.example.pft.dto.TransactionDTO;
import com.example.pft.entity.Transaction;
import com.example.pft.entity.User;
import com.example.pft.enums.TransactionType;
import com.example.pft.exception.ForbiddenException;
import com.example.pft.mapper.TransactionMapper;
import com.example.pft.repository.TransactionRepository;
import com.example.pft.support.TestDataFactory;
import com.example.pft.util.Constants;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

	@Mock
	private TransactionRepository transactionRepository;

	@Mock
	private TransactionMapper transactionMapper;

	@Mock
	private RedisService redisService;

	@InjectMocks
	private TransactionService transactionService;

	private User user;

	@BeforeEach
	void setUp() {
		this.user = TestDataFactory.createUser("ava@example.com");
		this.user.setId(1L);
	}

	@Test
	@DisplayName("Should create transaction, save to repository, and evict related cache entries")
	void createTransaction_validData_savesAndEvictsCaches() {
		final TransactionDTO dto = TestDataFactory.createTransactionDto();
		final Transaction entity = new Transaction();
		final TransactionDTO mapped = new TransactionDTO();
		mapped.setId(10L);

		when(this.transactionMapper.toEntity(dto)).thenReturn(entity);
		when(this.transactionRepository.save(entity)).thenReturn(entity);
		when(this.transactionMapper.toDto(entity)).thenReturn(mapped);

		final TransactionDTO result = this.transactionService.createTransaction(this.user, dto);

		assertThat(result).isEqualTo(mapped);
		assertThat(entity.getUser()).isEqualTo(this.user);
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTION_PAGES + "1*");
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + "1*");
	}

	@Test
	@DisplayName("Should throw EntityNotFoundException when transaction ID does not exist")
	void getTransaction_missingTransaction_throwsEntityNotFound() {
		when(this.transactionRepository.findById(99L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.transactionService.getTransaction(this.user, 99L))
			.isInstanceOf(EntityNotFoundException.class);
	}

	@Test
	@DisplayName("Should throw ForbiddenException when user tries to access another user's transaction")
	void getTransaction_differentOwner_throwsForbidden() {
		final User other = TestDataFactory.createUser("other@example.com");
		other.setId(2L);
		final Transaction transaction = TestDataFactory.createTransaction(other, LocalDate.now(), new BigDecimal("10.00"));

		when(this.transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

		assertThatThrownBy(() -> this.transactionService.getTransaction(this.user, 1L))
			.isInstanceOf(ForbiddenException.class);
	}

	@Test
	@DisplayName("Should return transaction DTO when user is the owner of the transaction")
	void getTransaction_ownerMatch_returnsDto() {
		final Transaction transaction =
			TestDataFactory.createTransaction(this.user, LocalDate.now(), new BigDecimal("20.00"));
		final TransactionDTO dto = new TransactionDTO();
		dto.setId(5L);

		when(this.transactionRepository.findById(5L)).thenReturn(Optional.of(transaction));
		when(this.transactionMapper.toDto(transaction)).thenReturn(dto);

		final TransactionDTO result = this.transactionService.getTransaction(this.user, 5L);

		assertThat(result).isEqualTo(dto);
	}

	@Test
	@DisplayName("Should throw EntityNotFoundException when updating non-existent transaction")
	void updateTransaction_missingTransaction_throwsEntityNotFound() {
		when(this.transactionRepository.findById(44L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.transactionService.updateTransaction(this.user, 44L, new TransactionDTO()))
			.isInstanceOf(EntityNotFoundException.class);
	}

	@Test
	@DisplayName("Should throw AccessDeniedException when user tries to update another user's transaction")
	void updateTransaction_differentOwner_throwsAccessDenied() {
		final User other = TestDataFactory.createUser("other@example.com");
		other.setId(2L);
		final Transaction transaction = TestDataFactory.createTransaction(other, LocalDate.now(), new BigDecimal("10.00"));

		when(this.transactionRepository.findById(5L)).thenReturn(Optional.of(transaction));

		assertThatThrownBy(() -> this.transactionService.updateTransaction(this.user, 5L, new TransactionDTO()))
			.isInstanceOf(AccessDeniedException.class);
	}

	@Test
	@DisplayName("Should update transaction fields and evict cache when user is the owner")
	void updateTransaction_validData_updatesFields() {
		final Transaction existing =
			TestDataFactory.createTransaction(this.user, LocalDate.of(2024, 1, 1), new BigDecimal("20.00"));
		existing.setId(5L);
		existing.setType(TransactionType.EXPENSE);

		final TransactionDTO dto = new TransactionDTO();
		dto.setTitle("Updated");
		dto.setAmount(new BigDecimal("35.50"));
		dto.setDate(LocalDate.of(2024, 2, 2));
		dto.setCategory("New");
		dto.setDescription("Updated description");
		dto.setRecurring(true);
		dto.setType(null);

		final TransactionDTO mapped = new TransactionDTO();
		mapped.setId(5L);

		when(this.transactionRepository.findById(5L)).thenReturn(Optional.of(existing));
		when(this.transactionRepository.save(existing)).thenReturn(existing);
		when(this.transactionMapper.toDto(existing)).thenReturn(mapped);

		final TransactionDTO result = this.transactionService.updateTransaction(this.user, 5L, dto);

		assertThat(result).isEqualTo(mapped);
		assertThat(existing.getTitle()).isEqualTo("Updated");
		assertThat(existing.getAmount()).isEqualTo(new BigDecimal("35.50"));
		assertThat(existing.getDate()).isEqualTo(LocalDate.of(2024, 2, 2));
		assertThat(existing.getCategory()).isEqualTo("New");
		assertThat(existing.getDescription()).isEqualTo("Updated description");
		assertThat(existing.isRecurring()).isTrue();
		assertThat(existing.getType()).isEqualTo(TransactionType.EXPENSE);
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTION_PAGES + "1*");
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + "1*");
	}

	@Test
	@DisplayName("Should throw EntityNotFoundException when deleting non-existent transaction")
	void deleteTransaction_missingTransaction_throwsEntityNotFound() {
		when(this.transactionRepository.findById(9L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.transactionService.deleteTransaction(this.user, 9L))
			.isInstanceOf(EntityNotFoundException.class);
	}

	@Test
	@DisplayName("Should throw AccessDeniedException when user tries to delete another user's transaction")
	void deleteTransaction_differentOwner_throwsAccessDenied() {
		final User other = TestDataFactory.createUser("other@example.com");
		other.setId(2L);
		final Transaction transaction = TestDataFactory.createTransaction(other, LocalDate.now(), new BigDecimal("10.00"));

		when(this.transactionRepository.findById(7L)).thenReturn(Optional.of(transaction));

		assertThatThrownBy(() -> this.transactionService.deleteTransaction(this.user, 7L))
			.isInstanceOf(AccessDeniedException.class);
	}

	@Test
	@DisplayName("Should delete transaction and evict cache when user is the owner")
	void deleteTransaction_validData_deletesAndEvictsCaches() {
		final Transaction transaction =
			TestDataFactory.createTransaction(this.user, LocalDate.now(), new BigDecimal("10.00"));

		when(this.transactionRepository.findById(7L)).thenReturn(Optional.of(transaction));

		this.transactionService.deleteTransaction(this.user, 7L);

		verify(this.transactionRepository).delete(transaction);
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTION_PAGES + "1*");
		verify(this.redisService).evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + "1*");
	}

	@Test
	@DisplayName("Should return paginated transaction list sorted by date descending")
	void transactionsList_returnsPaginatedResponse() {
		final Transaction first = TestDataFactory.createTransaction(this.user, LocalDate.now(), new BigDecimal("12.00"));
		final Transaction second =
			TestDataFactory.createTransaction(this.user, LocalDate.now().minusDays(1), new BigDecimal("15.00"));
		final List<Transaction> transactions = List.of(first, second);
		final Page<Transaction> page =
			new PageImpl<>(transactions, PageRequest.of(0, 20, Sort.by("date").descending()), transactions.size());
		final List<TransactionDTO> dtos = List.of(new TransactionDTO(), new TransactionDTO());

		when(this.transactionRepository.findByUserId(eq(this.user.getId()), any(Pageable.class))).thenReturn(page);
		when(this.transactionMapper.toDtoList(transactions)).thenReturn(dtos);

		final PaginatedResponse<TransactionDTO> response =
			this.transactionService.transactionsList(this.user, 0, 20, "date", "DESC");

		assertThat(response.getContent()).hasSize(2);
		assertThat(response.getTotalElements()).isEqualTo(2);
		assertThat(response.getTotalPages()).isEqualTo(1);
		assertThat(response.getPage()).isEqualTo(0);
		assertThat(response.getSize()).isEqualTo(20);

		final ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
		verify(this.transactionRepository).findByUserId(eq(this.user.getId()), pageableCaptor.capture());
		assertThat(pageableCaptor.getValue().getSort().getOrderFor("date").isDescending()).isTrue();
	}

	@Test
	@DisplayName("Should return list of transactions within date range ordered by date ascending")
	void fetchTransactionsBetween_returnsMappedList() {
		final LocalDate from = LocalDate.of(2025, 1, 1);
		final LocalDate to = LocalDate.of(2025, 1, 31);
		final List<Transaction> transactions =
			List.of(TestDataFactory.createTransaction(this.user, from, new BigDecimal("15.00")));
		final List<TransactionDTO> dtos = List.of(new TransactionDTO());

		when(this.transactionRepository.findByUserIdAndDateBetweenOrderByDateAsc(this.user.getId(), from, to))
			.thenReturn(transactions);
		when(this.transactionMapper.toDtoList(transactions)).thenReturn(dtos);

		final List<TransactionDTO> result =
			this.transactionService.fetchTransactionsBetween(this.user, from, to);

		assertThat(result).isEqualTo(dtos);
	}
}
