package com.example.pft.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.example.pft.dto.UserDTO;
import com.example.pft.entity.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

	UserDTO toDto(User user);

	List<UserDTO> toDtoList(List<User> users);
}
