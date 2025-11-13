package com.example.pft.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pft.dto.PaginatedResponse;
import com.example.pft.dto.TransactionDTO;
import com.example.pft.entity.Transaction;
import com.example.pft.entity.User;
import com.example.pft.exception.ForbiddenException;
import com.example.pft.mapper.TransactionMapper;
import com.example.pft.repository.TransactionRepository;
import com.example.pft.util.Constants;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

	private final TransactionRepository transactionRepository;
	private final TransactionMapper transactionMapper;
	private final RedisService redisService;

	@Transactional
	@CachePut(value = Constants.CACHE_TRANSACTIONS, key = "#user.id + ':' + #result.id")
	public TransactionDTO createTransaction(final User user, final TransactionDTO dto) {
		final Transaction tx = this.transactionMapper.toEntity(dto);
		tx.setUser(user);
		final Transaction saved = this.transactionRepository.save(tx);
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTION_PAGES + user.getId().toString() + "*");
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + user.getId().toString() + "*");
		return this.transactionMapper.toDto(saved);
	}

	@Cacheable(value = Constants.CACHE_TRANSACTIONS, key = "#user.id + ':' + #id")
	public TransactionDTO getTransaction(final User user, @NonNull final Long id) {
		final Transaction transaction = this.transactionRepository
			.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

		if (!transaction.getUser().getId().equals(user.getId()))
			throw new ForbiddenException("You do not have permission to access this transaction");
		return this.transactionMapper.toDto(transaction);
	}

	@Transactional
	@CachePut(value = Constants.CACHE_TRANSACTIONS, key = "#user.id + ':' + #id")
	public TransactionDTO updateTransaction(final User user, @NonNull final Long id, final TransactionDTO dto) {
		final Transaction existing = this.transactionRepository
			.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
		if (!existing.getUser().getId().equals(user.getId()))
			throw new AccessDeniedException("Forbidden");

		existing.setTitle(dto.getTitle());
		existing.setAmount(dto.getAmount());
		existing.setDate(dto.getDate());
		existing.setCategory(dto.getCategory());
		existing.setType(dto.getType() != null ? dto.getType() : existing.getType());
		existing.setDescription(dto.getDescription());
		existing.setRecurring(dto.isRecurring());
		final Transaction saved = this.transactionRepository.save(existing);
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTION_PAGES + user.getId().toString() + "*");
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + user.getId().toString() + "*");
		return this.transactionMapper.toDto(saved);
	}

	@Transactional
	@CacheEvict(value = Constants.CACHE_TRANSACTIONS, key = "#user.id + ':' + #id")
	public void deleteTransaction(final User user, @NonNull final Long id) {
		final Transaction tx = this.transactionRepository
			.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
		if (!tx.getUser().getId().equals(user.getId()))
			throw new AccessDeniedException("Forbidden");
		this.transactionRepository.delete(tx);
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTION_PAGES + user.getId().toString() + "*");
		this.redisService.evictByPattern(Constants.CACHE_TRANSACTIONS_BETWEEN + user.getId().toString() + "*");
	}

	@Transactional(readOnly = true)
	@Cacheable(
		value = Constants.CACHE_TRANSACTION_PAGES_KEY,
		key = "#user.id + ':' + #page + ':' + #size + ':' + #sortBy + ':' + #sortDir"
	)
	public PaginatedResponse<TransactionDTO> transactionsList(
		final User user, final int page, final int size, final String sortBy, final String sortDir
	) {
		final Sort sort = "desc".equalsIgnoreCase(sortDir) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		final Pageable pageable = PageRequest.of(page, size, sort);
		final Page<Transaction> p = this.transactionRepository.findByUserId(user.getId(), pageable);
		final List<TransactionDTO> dtos = this.transactionMapper.toDtoList(p.getContent());
		return new PaginatedResponse<>(dtos, p.getTotalElements(), p.getTotalPages(), p.getNumber(), p.getSize());
	}

	@Cacheable(
		value = Constants.CACHE_TRANSACTIONS_BETWEEN_KEY,
		key = "#user.id + ':' + #from.toString() + ':' + #to.toString()", unless = "#result.isEmpty()"
	)
	@Transactional(readOnly = true)
	public List<TransactionDTO> fetchTransactionsBetween(final User user, final LocalDate from, final LocalDate to) {
		final List<Transaction> list =
			this.transactionRepository.findByUserIdAndDateBetweenOrderByDateAsc(user.getId(), from, to);
		return this.transactionMapper.toDtoList(list);
	}
}
