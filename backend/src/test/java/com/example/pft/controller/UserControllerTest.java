package com.example.pft.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;
import com.example.pft.exception.GlobalExceptionHandler;
import com.example.pft.mapper.UserMapper;
import com.example.pft.repository.UserRepository;
import com.example.pft.security.JwtTokenProvider;
import com.example.pft.support.TestDataFactory;

@WebMvcTest(UserController.class)
@Import({GlobalExceptionHandler.class, UserControllerTest.MethodSecurityConfig.class})
class UserControllerTest {

	@TestConfiguration
	@EnableMethodSecurity
	static class MethodSecurityConfig {
	}

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private UserRepository userRepository;

	@MockitoBean
	private UserMapper userMapper;

	@MockitoBean
	private JwtTokenProvider jwtTokenProvider;

	@Test
	@DisplayName("Should return user list when admin user requests all users")
	void getAllUsers_withAdminRole_shouldReturnUserList() throws Exception {
		final User user = TestDataFactory.createUser("admin@example.com");
		final UserDTO dto = TestDataFactory.createUserDto("admin@example.com");

		when(this.userRepository.findAll()).thenReturn(List.of(user));
		when(this.userMapper.toDto(user)).thenReturn(dto);

		this.mockMvc
			.perform(get("/api/users").with(user("admin@example.com").roles("ADMIN")))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].email").value("admin@example.com"));

		verify(this.userRepository).findAll();
		verify(this.userMapper).toDto(user);
	}

	@Test
	@DisplayName("Should return forbidden when non-admin user requests all users")
	void getAllUsers_withNonAdminRole_shouldReturnForbidden() throws Exception {
		this.mockMvc.perform(get("/api/users").with(user("user@example.com").roles("USER"))).andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("Should return success message when admin accesses admin-only endpoint")
	void adminEndpoint_withAdminRole_shouldReturnSuccess() throws Exception {
		this.mockMvc
			.perform(get("/api/users/admin").with(user("admin@example.com").roles("ADMIN")))
			.andExpect(status().isOk())
			.andExpect(content().string("Only ADMIN can see this"));
	}

	@Test
	@DisplayName("Should allow all authenticated users to access admin endpoint")
	void adminEndpoint_shouldBeAccessibleToAllUsers() throws Exception {
		this.mockMvc
			.perform(get("/api/users/admin").with(user("user@example.com").roles("USER")))
			.andExpect(status().isOk())
			.andExpect(content().string("Only ADMIN can see this"));
	}

	@Test
	@DisplayName("Should return empty list when admin requests all users but database is empty")
	void getAllUsers_withEmptyDatabase_shouldReturnEmptyList() throws Exception {
		when(this.userRepository.findAll()).thenReturn(List.of());

		this.mockMvc
			.perform(get("/api/users").with(user("admin@example.com").roles("ADMIN")))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(0)));

		verify(this.userRepository).findAll();
		verifyNoMoreInteractions(this.userMapper);
	}
}
