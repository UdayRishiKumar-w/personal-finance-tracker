package com.example.pft.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.pft.dto.UserDTO;
import com.example.pft.exception.InvalidateException;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final UserMapper userMapper;

	public UserDTO getUser(final Long id) {
		return this.userRepository.findById(id)
				.map(this.userMapper::toDto)
				.orElseThrow(() -> new InvalidateException("User not found"));
	}

	public List<UserDTO> getAllUsers() {
		return this.userMapper.toDtoList(this.userRepository.findAll());
	}

}
