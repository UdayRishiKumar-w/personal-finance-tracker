package com.example.pft.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UserRepository userRepository;
	private final JwtTokenProvider tokenProvider;

	public AuthController(UserRepository userRepository, JwtTokenProvider tokenProvider) {
		this.userRepository = userRepository;
		this.tokenProvider = tokenProvider;
	}

	public record LoginRequest(String email, String password) {
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
		var userOpt = userRepository.findByEmail(request.email());
		if (userOpt.isEmpty())
			return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
		var user = userOpt.get();
		// NOTE: password is stored raw in this minimal scaffold. Replace with bcrypt in
		// prod.
		if (!user.getPassword().equals(request.password()))
			return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
		var token = tokenProvider.generateToken(user.getEmail());
		return ResponseEntity.ok(Map.of("accessToken", token, "user",
				Map.of("id", user.getId(), "email", user.getEmail())));
	}
}
