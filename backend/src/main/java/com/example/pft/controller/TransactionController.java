package com.example.pft.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.entity.Transaction;
import com.example.pft.repository.TransactionRepository;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
	private final TransactionRepository repo;

	public TransactionController(TransactionRepository repo) {
		this.repo = repo;
	}

	@GetMapping
	public List<Transaction> list(@RequestParam Long userId) {
		return repo.findByUserIdOrderByDateDesc(userId);
	}

	@PostMapping
	public Transaction create(@RequestBody Transaction t) {
		return repo.save(t);
	}
}
