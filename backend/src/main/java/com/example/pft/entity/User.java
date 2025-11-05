package com.example.pft.entity;

import java.io.Serial;
import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.pft.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {
	@Serial
	private static final long serialVersionUID = 1964792468320948930L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Email
	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@ToString.Exclude
	@Column(nullable = false)
	private String password;

	@Column(updatable = false, name = "created_at")
	private Long createdAt;

	@Column(name = "updated_at")
	private Long updatedAt;

	@Enumerated(EnumType.STRING)
	private Role role;

	@JsonIgnore
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private RefreshToken refreshToken;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Transaction> transactions;

	@PrePersist
	protected void onCreate() {
		final long now = Instant.now().toEpochMilli();
		this.createdAt = now;
		this.updatedAt = now;
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = Instant.now().toEpochMilli();
	}

	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		final Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		if (this.role == null) {
			return authorities;
		}
		authorities.add(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
		final Set<SimpleGrantedAuthority> permissionAuthorities = this.role
			.getPermissions()
			.stream()
			.map(permissions -> new SimpleGrantedAuthority(permissions.name()))
			.collect(Collectors.toSet());
		authorities.addAll(permissionAuthorities);
		return authorities;
	}

	@JsonIgnore
	@Override
	public String getUsername() {
		return this.email;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return UserDetails.super.isAccountNonExpired();
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return UserDetails.super.isAccountNonLocked();
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return UserDetails.super.isCredentialsNonExpired();
	}

	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return UserDetails.super.isEnabled();
	}
}
