package com.example.pft.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.UserDTO;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;
	private final UserMapper mapper;

	public UserController(UserRepository userRepository, UserMapper mapper) {
		this.userRepository = userRepository;
		this.mapper = mapper;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping
	public List<UserDTO> getAllUsers() {
		return userRepository.findAll().stream()
				.map(mapper::toDto).toList();
	}

	@GetMapping("/admin")
	public String adminEndpoint() {
		return "Only ADMIN can see this";
	}
}
