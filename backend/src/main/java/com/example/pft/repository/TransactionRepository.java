package com.example.pft.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.pft.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	Page<Transaction> findByUserId(Long userId, Pageable p);

	List<Transaction> findByUserIdOrderByDateDesc(Long userId);

	List<Transaction> findByUserIdAndDateBetweenOrderByDateAsc(Long userId, LocalDate from, LocalDate to);

	long countByUserId(Long userId);
}
