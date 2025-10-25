package com.example.pft.service;

import java.util.List;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;
import com.example.pft.exception.InvalidateException;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final UserMapper userMapper;

	public UserDTO getUser(final String email) {
		return this.userRepository.findByEmail(email)
				.map(this.userMapper::toDto)
				.orElseThrow(() -> new InvalidateException("User not found"));
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "users", key = "#email", unless = "#result == null")
	public User loadUserByEmail(final String email) {
		return this.userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	@Transactional
	@CachePut(value = "users", key = "#user.email")
	public User saveUser(final User user) {
		return this.userRepository.save(user);
	}

	public List<UserDTO> getAllUsers() {
		return this.userMapper.toDtoList(this.userRepository.findAll());
	}

}
