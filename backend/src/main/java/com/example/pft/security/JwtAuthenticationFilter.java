package com.example.pft.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.pft.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

	@Override
	protected void doFilterInternal(@NonNull final HttpServletRequest request,
			@NonNull final HttpServletResponse response,
			@NonNull final FilterChain chain) throws IOException, ServletException {

		if (request.getRequestURI().startsWith("/auth/")) {
			// Skip JWT filter for /auth/** paths
			chain.doFilter(request, response);
			return;
		}

		String accessToken = null;
		if (request.getCookies() != null) {
			for (final Cookie cookie : request.getCookies()) {
				if ("accessToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
					break;
				}
			}
		}

		if (accessToken == null) {
			chain.doFilter(request, response);
			return;
		}

		final String email = this.jwtTokenProvider.getUsernameFromToken(accessToken);
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			final com.example.pft.entity.User user = this.userRepository.findByEmail(email).orElse(null);

			if (user != null && this.jwtTokenProvider.isTokenValid(accessToken, user.getEmail())) {
				final UserDetails userDetails = User
						.withUsername(user.getEmail())
						.password(user.getPassword())
						.roles(user.getRole().name())
						.build();

				final UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails,
						null,
						userDetails.getAuthorities());
				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(auth);
			}
		}

		chain.doFilter(request, response);
	}

}
