package com.example.pft.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.PaginatedResponse;
import com.example.pft.dto.TransactionDTO;
import com.example.pft.entity.User;
import com.example.pft.exception.BadRequestException;
import com.example.pft.exception.ResourceNotFoundException;
import com.example.pft.exception.UnauthorizedException;
import com.example.pft.repository.UserRepository;
import com.example.pft.service.TransactionService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

	private final TransactionService service;
	private final UserRepository userRepository;

	private User getCurrentUser() {
		final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
			throw new UnauthorizedException("Authentication required");
		final String email = auth.getName();
		return this.userRepository
			.findByEmail(email)
			.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	@PostMapping
	public ResponseEntity<TransactionDTO> create(@RequestBody @Valid final TransactionDTO dto) {
		final User user = this.getCurrentUser();
		final TransactionDTO created = this.service.createTransaction(user, dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<TransactionDTO> update(
		@PathVariable @NonNull final Long id, @RequestBody @Valid final TransactionDTO dto
	) {
		final User user = this.getCurrentUser();
		return ResponseEntity.ok(this.service.updateTransaction(user, id, dto));
	}

	@GetMapping
	public ResponseEntity<PaginatedResponse<TransactionDTO>> list(
		@RequestParam(defaultValue = "0") @Min(0) final int page,
		@RequestParam(defaultValue = "20") @Min(1) @Max(1000) final int size,
		@RequestParam(defaultValue = "date")
		@Pattern(regexp = "^(date|amount|category|description)$") final String sortBy,
		@RequestParam(defaultValue = "DESC") @Pattern(regexp = "^(ASC|DESC)$") final String sortDir
	) {
		log.info("Listing transactions: page={}, size={}, sortBy={}, sortDir={}", page, size, sortBy, sortDir);
		final User user = this.getCurrentUser();
		return ResponseEntity.ok(this.service.transactionsList(user, page, size, sortBy, sortDir));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable @NonNull final Long id) {
		final User user = this.getCurrentUser();
		this.service.deleteTransaction(user, id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/range")
	public ResponseEntity<List<TransactionDTO>> range(
		@RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate from,
		@RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate to
	) {
		if (from.isAfter(to)) {
			throw new BadRequestException("From date must be before or equal to to date");
		}
		if (java.time.temporal.ChronoUnit.DAYS.between(from, to) > 365) {
			throw new BadRequestException("Date range cannot exceed 365 days");
		}
		final User user = this.getCurrentUser();
		return ResponseEntity.ok(this.service.fetchTransactionsBetween(user, from, to));
	}
}
