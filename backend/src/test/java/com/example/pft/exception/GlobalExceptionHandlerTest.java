package com.example.pft.exception;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mock.http.MockHttpInputMessage;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MissingServletRequestParameterException;

import com.example.pft.util.Constants;

import io.jsonwebtoken.security.SecurityException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;

class GlobalExceptionHandlerTest {

	private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

	@Test
	@DisplayName("Should return conflict response with status 409 for ConflictException")
	void handleConflict_returnsConflictResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleConflict(new ConflictException("duplicate"));

		assertResponse(response, HttpStatus.CONFLICT, "duplicate");
	}

	@Test
	@DisplayName("Should return unauthorized response with status 401 for UnauthorizedException")
	void handleUnauthorized_returnsUnauthorizedResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleUnauthorized(new UnauthorizedException("unauthorized"));

		assertResponse(response, HttpStatus.UNAUTHORIZED, "unauthorized");
	}

	@Test
	@DisplayName("Should return forbidden response with status 403 for AccessDeniedException")
	void handleAccessDenied_returnsForbiddenResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleAccessDenied(new AccessDeniedException("denied"));

		assertResponse(response, HttpStatus.FORBIDDEN, "Access denied");
	}

	@Test
	@DisplayName("Should return unauthorized with 'Invalid email or password' for BadCredentialsException")
	void handleAuthentication_invalidCredentials_returnsMessage() {
		final AuthenticationException ex = new AuthenticationException("Bad credentials") {
		};
		final ResponseEntity<Map<String, Object>> response = this.handler.handleAuthentication(ex);

		assertResponse(response, HttpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	@Test
	@DisplayName("Should return unauthorized with 'Credentials expired' message for expired credentials")
	void handleAuthentication_expiredCredentials_returnsMessage() {
		final AuthenticationException ex = new AuthenticationException("Credentials expired") {
		};
		final ResponseEntity<Map<String, Object>> response = this.handler.handleAuthentication(ex);

		assertResponse(response, HttpStatus.UNAUTHORIZED, "Credentials have expired");
	}

	@Test
	@DisplayName("Should return unauthorized response with status 401 for JWT SecurityException")
	void handleJwtExceptions_returnsUnauthorizedResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleJwtExceptions(new SecurityException("invalid"));

		assertResponse(response, HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token");
	}

	@Test
	@DisplayName("Should return unauthorized response with status 401 for JwtAuthenticationException")
	void handleJwtAuth_returnsUnauthorizedResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleJwtAuth(new JwtAuthenticationException("invalid"));

		assertResponse(response, HttpStatus.UNAUTHORIZED, "invalid");
	}

	@Test
	@DisplayName("Should return not found response with status 404 for ResourceNotFoundException")
	void handleNotFound_returnsNotFoundResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleNotFound(new ResourceNotFoundException("missing"));

		assertResponse(response, HttpStatus.NOT_FOUND, "missing");
	}

	@Test
	@DisplayName("Should return forbidden response with status 403 for ForbiddenException")
	void handleForbidden_returnsForbiddenResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleForbidden(new ForbiddenException("forbidden"));

		assertResponse(response, HttpStatus.FORBIDDEN, "forbidden");
	}

	@Test
	@DisplayName("Should return bad request with generic error message for InvalidateException")
	void handleInvalidate_returnsBadRequestResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleInvalidate(new InvalidateException("fail"));

		assertResponse(response, HttpStatus.BAD_REQUEST, Constants.PFT_GENERIC_ERROR_MESSAGE);
	}

	@Test
	@DisplayName("Should return bad request with validation message for ConstraintViolationException")
	void handleConstraintViolation_returnsBadRequestResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleConstraintViolation(new ConstraintViolationException("invalid", Set.of()));

		assertResponse(response, HttpStatus.BAD_REQUEST, "Validation failed");
	}

	@Test
	@DisplayName("Should return bad request with parameter message for MissingServletRequestParameterException")
	void handleMissingParams_returnsBadRequestResponse() {
		final MissingServletRequestParameterException ex =
			new MissingServletRequestParameterException("from", "LocalDate");
		final ResponseEntity<Map<String, Object>> response = this.handler.handleMissingParams(ex);

		assertResponse(response, HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@Test
	@DisplayName("Should return bad request response with status 400 for BadRequestException")
	void handleBadRequest_returnsBadRequestResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleBadRequest(new BadRequestException("bad"));

		assertResponse(response, HttpStatus.BAD_REQUEST, "bad");
	}

	@Test
	@DisplayName("Should return not found with 'Resource not found' for EntityNotFoundException")
	void handleEntityNotFound_returnsNotFoundResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleEntityNotFound(new EntityNotFoundException("missing"));

		assertResponse(response, HttpStatus.NOT_FOUND, "Resource not found");
	}

	@Test
	@DisplayName("Should return conflict with 'Data integrity violation' for DataIntegrityViolationException")
	void handleDataIntegrity_returnsConflictResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleDataIntegrity(new DataIntegrityViolationException("violation"));

		assertResponse(response, HttpStatus.CONFLICT, "Data integrity violation");
	}

	@Test
	@DisplayName("Should return bad request with 'Malformed request body' for HttpMessageNotReadableException")
	void handleUnreadableMessage_returnsBadRequestResponse() {
		final MockHttpInputMessage inputMessage = new MockHttpInputMessage("{}".getBytes(java.nio.charset.StandardCharsets.UTF_8));
		final HttpMessageNotReadableException ex =
			new HttpMessageNotReadableException("bad", inputMessage);

		final ResponseEntity<Map<String, Object>> response = this.handler.handleUnreadableMessage(ex);

		assertResponse(response, HttpStatus.BAD_REQUEST, "Malformed request body");
	}

	@Test
	@DisplayName("Should return internal server error with status 500 for generic RuntimeException")
	void handleAll_returnsInternalServerErrorResponse() {
		final ResponseEntity<Map<String, Object>> response = this.handler.handleAll(new RuntimeException("boom"));

		assertResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
	}

	@Test
	@DisplayName("Should return bad request with argument message for IllegalArgumentException")
	void handleIllegalArgument_returnsBadRequestResponse() {
		final ResponseEntity<Map<String, Object>> response =
			this.handler.handleIllegalArgument(new IllegalArgumentException("invalid"));

		assertResponse(response, HttpStatus.BAD_REQUEST, "invalid");
	}

	private void assertResponse(
		final ResponseEntity<Map<String, Object>> response, final HttpStatus status, final String message
	) {
		assertThat(response.getStatusCode()).isEqualTo(status);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().get("status")).isEqualTo(status.value());
		assertThat(response.getBody().get("message")).isEqualTo(message);
	}
}
