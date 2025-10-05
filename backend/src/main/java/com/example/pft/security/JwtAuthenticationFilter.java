package com.example.pft.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import com.example.pft.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilter {

	private final transient JwtTokenProvider jwtTokenProvider;
	private final transient UserRepository userRepository;

	@Override
	public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
			throws IOException, ServletException {

		final HttpServletRequest req = (HttpServletRequest) request;

		String accessToken = null;
		if (req.getCookies() != null) {
			for (final Cookie cookie : req.getCookies()) {
				if ("accessToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
				}
			}
		}

		// if (request.getRequestId().startsWith("/auth/")) {
		// // Skip JWT filter for /auth/** paths
		// chain.doFilter(request, response);
		// return;
		// }

		if (accessToken == null) {
			chain.doFilter(request, response);
			return;
		}

		final String email = this.jwtTokenProvider.getUsernameFromToken(accessToken);
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			final var user = this.userRepository.findByEmail(email).orElse(null);

			if (user != null && this.jwtTokenProvider.isTokenValid(accessToken, user.getEmail())) {
				final UserDetails userDetails = org.springframework.security.core.userdetails.User
						.withUsername(user.getEmail())
						.password(user.getPassword())
						.roles(user.getRole().name().replace("ROLE_", ""))
						.build();

				final UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails,
						null,
						userDetails.getAuthorities());
				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

				SecurityContextHolder.getContext().setAuthentication(auth);
			}
		}

		chain.doFilter(request, response);
	}

}
