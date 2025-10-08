package com.example.pft.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
		@NotBlank(message = "Email is required") @Email(message = "Email should be valid") String email,
		@NotBlank(message = "Password is required") String password) {

	@Override
	public String toString() {
		return "LoginRequestDTO[email=" + this.email + ", password=****]";
	}
}
