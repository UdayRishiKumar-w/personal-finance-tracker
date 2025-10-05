package com.example.pft.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
	private String accessToken;
	private String refreshToken;
}
