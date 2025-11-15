package com.example.pft.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.example.pft.dto.SignUpRequestDTO;
import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

	@Mapping(source = "role", target = "role")
	UserDTO toDto(User user);

	List<UserDTO> toDtoList(List<User> users);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	@Mapping(target = "role", ignore = true)
	@Mapping(target = "password", ignore = true)
	@Mapping(target = "refreshToken", ignore = true)
	@Mapping(target = "transactions", ignore = true)
	User toEntity(SignUpRequestDTO request);
}
