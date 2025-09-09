package com.example.pft.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.LoginRequest;
import com.example.pft.entity.User;
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

	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@RequestBody LoginRequest request) {
		// Check if user already exists
		Optional<User> userOpt = userRepository.findByEmail(request.email());
		if (userOpt.isPresent()) {
			return ResponseEntity.status(409).body(Map.of("message", "User already exists"));
		}
		// Create new user (NOTE: password should be hashed in production)
		User newUser = new User();
		newUser.setEmail(request.email());
		newUser.setPassword(request.password());
		userRepository.save(newUser);
		String token = tokenProvider.generateToken(newUser.getEmail());
		return ResponseEntity.ok(Map.of("accessToken", token, "user",
				Map.of("id", newUser.getId(), "email", newUser.getEmail())));
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
		Optional<User> userOpt = userRepository.findByEmail(request.email());
		if (userOpt.isEmpty())
			return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
		User user = userOpt.get();
		// NOTE: password is stored raw in this minimal scaffold. Replace with bcrypt in
		// prod.
		if (!user.getPassword().equals(request.password()))
			return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
		String token = tokenProvider.generateToken(user.getEmail());
		return ResponseEntity.ok(Map.of("accessToken", token, "user",
				Map.of("id", user.getId(), "email", user.getEmail())));
	}
}
