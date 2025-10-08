package com.example.pft.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignUpRequestDTO(
		@NotBlank(message = "Email is required") @Email(message = "Email should be valid") @Size(max = 255, message = "Email must not exceed 255 characters") String email,

		@NotBlank(message = "Password is required") @Size(min = 10, max = 128, message = "Password must be between 10 and 128 characters") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$", message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character") String password,
		@NotBlank(message = "First name is required") @Size(max = 50, message = "First name must not exceed 50 characters") String firstName,

		@NotBlank(message = "Last name is required") @Size(max = 50, message = "Last name must not exceed 50 characters") String lastName) {
}
