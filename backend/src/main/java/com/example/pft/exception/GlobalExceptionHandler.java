package com.example.pft.exception;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidateException.class)
	public ResponseEntity<Map<String, Object>> handleCustom(final InvalidateException ex) {
		log.warn("InvalidateException occurred: {}", ex.getMessage(), ex);
		final String errorMessage = ex.getMessage() != null ? ex.getMessage() : "Validation error";
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
				"timestamp", LocalDateTime.now(),
				"error", errorMessage));
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, Object>> handleRuntime(final RuntimeException ex) {
		log.error("Unexpected RuntimeException occurred: {}", ex.getMessage(), ex);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"timestamp", LocalDateTime.now(),
				"error", "Internal server error"));
	}
}
