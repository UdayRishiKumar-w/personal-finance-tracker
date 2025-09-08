package com.example.pft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.pft.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByUserIdOrderByDateDesc(Long userId);
}
