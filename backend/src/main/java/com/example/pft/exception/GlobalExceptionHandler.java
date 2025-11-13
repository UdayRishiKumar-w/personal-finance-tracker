package com.example.pft.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.pft.util.Constants;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SecurityException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<Map<String, Object>> handleConflict(final ConflictException ex) {
		log.warn("ConflictException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<Map<String, Object>> handleUnauthorized(final UnauthorizedException ex) {
		log.warn("UnauthorizedException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, Object>> handleAccessDenied(final AccessDeniedException ex) {
		log.warn("AccessDeniedException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.FORBIDDEN, "Access denied");
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<Map<String, Object>> handleAuthentication(final AuthenticationException ex) {
		log.warn("Authentication exception: {}", ex.getMessage());
		String message = "Authentication failed";

		// Provide user-friendly message for common auth failures
		if (ex.getMessage() != null && ex.getMessage().contains("Credentials expired")) {
			message = "Credentials have expired";
		} else if (ex.getMessage() != null && (ex.getMessage().contains("Bad credentials") || ex
			.getMessage()
			.contains("Invalid password"))) {
			message = "Invalid email or password";
		}

		return this.errorResponse(HttpStatus.UNAUTHORIZED, message);
	}

	@ExceptionHandler(
		{ExpiredJwtException.class, MalformedJwtException.class, UnsupportedJwtException.class, SecurityException.class}
	)
	public ResponseEntity<Map<String, Object>> handleJwtExceptions(final Exception ex) {
		log.warn("JWT exception: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token");
	}

	@ExceptionHandler(JwtAuthenticationException.class)
	public ResponseEntity<Map<String, Object>> handleJwtAuth(final JwtAuthenticationException ex) {
		log.warn("JwtAuthenticationException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleNotFound(final ResourceNotFoundException ex) {
		log.warn("ResourceNotFoundException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(ForbiddenException.class)
	public ResponseEntity<Map<String, Object>> handleForbidden(final ForbiddenException ex) {
		log.warn("ForbiddenException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
	}

	@ExceptionHandler(InvalidateException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidate(final InvalidateException ex) {
		log.warn("InvalidateException: {}", ex.getMessage(), ex);
		return this.errorResponse(HttpStatus.BAD_REQUEST, Constants.PFT_GENERIC_ERROR_MESSAGE);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<Map<String, Object>> handleConstraintViolation(final ConstraintViolationException ex) {
		log.warn("ConstraintViolationException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.BAD_REQUEST, "Validation failed");
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<Map<String, Object>> handleMissingParams(final MissingServletRequestParameterException ex) {
		log.warn("MissingServletRequestParameterException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<Map<String, Object>> handleBadRequest(final BadRequestException ex) {
		log.warn("BadRequestException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(final MethodArgumentNotValidException ex) {
		final List<String> errors = ex
			.getBindingResult()
			.getFieldErrors()
			.stream()
			.map((final FieldError fe) -> fe.getField() + ": " + fe.getDefaultMessage())
			.toList();

		log.warn("MethodArgumentNotValidException: {}", errors);
		final Map<String, Object> body = new HashMap<>();
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("errors", errors);
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler({EntityNotFoundException.class, NoSuchElementException.class})
	public ResponseEntity<Map<String, Object>> handleEntityNotFound(final Exception ex) {
		log.warn("Entity not found: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.NOT_FOUND, "Resource not found");
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, Object>> handleDataIntegrity(final DataIntegrityViolationException ex) {
		log.warn("DataIntegrityViolationException: {}", ex.getMessage(), ex);
		return this.errorResponse(HttpStatus.CONFLICT, "Data integrity violation");
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, Object>> handleUnreadableMessage(final HttpMessageNotReadableException ex) {
		log.warn("HttpMessageNotReadableException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.BAD_REQUEST, "Malformed request body");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleAll(final Exception ex) {
		log.error("Unhandled exception: {}", ex.getMessage(), ex);
		return this.errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(final IllegalArgumentException ex) {
		log.warn("IllegalArgumentException: {}", ex.getMessage());
		return this.errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	private ResponseEntity<Map<String, Object>> errorResponse(final HttpStatus status, final String message) {
		final Map<String, Object> body =
			Map.of("status", status.value(), "message", message == null ? status.getReasonPhrase() : message);
		return new ResponseEntity<>(body, new HttpHeaders(), status);
	}
}
