package com.example.pft.dto;

import java.time.LocalDate;

import com.example.pft.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class TransactionDTO {
	private Long id;
	private String title;
	private Double amount;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;

	private String category;
	private TransactionType type;
	private String description;
	private boolean recurring;

}
