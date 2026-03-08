package com.example.pft.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;
import com.example.pft.support.TestDataFactory;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private UserMapper userMapper;

	@InjectMocks
	private UserService userService;

	@Test
	@DisplayName("Should return user when email exists in database")
	void loadUserByEmail_existingUser_returnsUser() {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.findByEmail("ava@example.com")).thenReturn(Optional.of(user));

		final User result = this.userService.loadUserByEmail("ava@example.com");

		assertThat(result).isEqualTo(user);
		verify(this.userRepository).findByEmail("ava@example.com");
	}

	@Test
	@DisplayName("Should throw UsernameNotFoundException when email does not exist")
	void loadUserByEmail_missingUser_throwsUsernameNotFound() {
		when(this.userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> this.userService.loadUserByEmail("missing@example.com"))
			.isInstanceOf(UsernameNotFoundException.class);
	}

	@Test
	@DisplayName("Should save and return user when valid user is provided")
	void saveUser_validUser_persistsUser() {
		final User user = TestDataFactory.createUser("ava@example.com");
		when(this.userRepository.save(user)).thenReturn(user);

		final User saved = this.userService.saveUser(user);

		assertThat(saved).isEqualTo(user);
		verify(this.userRepository).save(user);
	}

	@Test
	@DisplayName("Should return list of user DTOs when retrieving all users")
	void getAllUsers_returnsMappedDtos() {
		final User user = TestDataFactory.createUser("ava@example.com");
		final UserDTO dto = TestDataFactory.createUserDto("ava@example.com");

		when(this.userRepository.findAll()).thenReturn(List.of(user));
		when(this.userMapper.toDtoList(List.of(user))).thenReturn(List.of(dto));

		final List<UserDTO> result = this.userService.getAllUsers();

		assertThat(result).containsExactly(dto);
		verify(this.userRepository).findAll();
		verify(this.userMapper).toDtoList(List.of(user));
	}
}
