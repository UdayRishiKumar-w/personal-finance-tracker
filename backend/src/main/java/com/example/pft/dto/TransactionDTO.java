package com.example.pft.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.pft.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransactionDTO {
	private Long id;

	@NotBlank(message = "Title is required")
	private String title;

	@NotNull(message = "Amount is required")
	@Positive(message = "Amount must be positive")
	private BigDecimal amount;

	@NotNull(message = "Date is required")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;

	@NotBlank(message = "Category is required")
	private String category;

	@NotNull(message = "Transaction type is required")
	private TransactionType type;
	private String description;
	private boolean recurring;

}
