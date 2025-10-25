package com.example.pft.enums;

import java.util.Set;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
	ADMIN(Set.of(Permissions.DASHBOARD_READ, Permissions.DASHBOARD_WRITE, Permissions.DASHBOARD_DELETE)),
	USER(Set.of(Permissions.DASHBOARD_READ));

	private final Set<Permissions> permissions;
}
