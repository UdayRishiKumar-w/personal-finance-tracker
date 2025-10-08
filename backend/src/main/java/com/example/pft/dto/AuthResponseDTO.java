package com.example.pft.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
public class AuthResponseDTO {
	@ToString.Exclude
	private String accessToken;
	@ToString.Exclude
	private String refreshToken;
}
