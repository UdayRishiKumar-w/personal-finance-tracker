package com.example.pft.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedResponse<T> {
	private List<T> content;
	private long totalElements;
	private int totalPages;
	private int page;
	private int size;
}
