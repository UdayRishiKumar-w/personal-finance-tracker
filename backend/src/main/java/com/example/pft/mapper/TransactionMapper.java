package com.example.pft.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import com.example.pft.dto.TransactionDTO;
import com.example.pft.entity.Transaction;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TransactionMapper {
	TransactionDTO toDto(Transaction t);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	Transaction toEntity(TransactionDTO dto);

	List<TransactionDTO> toDtoList(List<Transaction> list);
}
