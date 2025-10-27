package com.example.pft.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pft.dto.UserDTO;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;
	private final UserMapper mapper;

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public List<UserDTO> getAllUsers() {
		return this.userRepository.findAll().stream().map(this.mapper::toDto).toList();
	}

	@GetMapping("/admin")
	public String adminEndpoint() {
		return "Only ADMIN can see this";
	}
}
