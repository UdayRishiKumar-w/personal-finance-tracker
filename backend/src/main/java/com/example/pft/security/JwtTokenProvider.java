package com.example.pft.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {
	@Value("${jwt.secret}")
	private String jwtSecret;
	@Value("${jwt.expiration}")
	private long jwtExpirationMs;
	@Value("${jwt.refresh-expiration}")
	private long refreshExpirationMs;
	private SecretKey key;

	// Initializes the key after the class is instantiated and the jwtSecret is
	// injected,
	// preventing the repeated creation of the key and enhancing performance
	@PostConstruct
	public void init() {
		this.key = Keys.hmacShaKeyFor(this.jwtSecret.getBytes(StandardCharsets.UTF_8));
	}

	// Generate JWT token
	public String generateToken(final String username, final long expirationMs) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(this.key, SignatureAlgorithm.HS256)
				.compact();
	}

	public String generateAccessToken(final String username) {
		return this.generateToken(username, this.jwtExpirationMs);
	}

	public String generateRefreshToken(final String username) {
		return this.generateToken(username, this.refreshExpirationMs);
	}

	// Get username from JWT token
	public String getUsernameFromToken(final String token) {
		return Jwts.parserBuilder()
				.setSigningKey(this.key).build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}

	// Validate JWT token
	public boolean validateJwtToken(final String token) {
		try {
			Jwts.parserBuilder().setSigningKey(this.key).build().parseClaimsJws(token);
			return true;
		} catch (final SecurityException e) {
			log.info("Invalid JWT signature: {}", e.getMessage());
		} catch (final MalformedJwtException e) {
			log.info("Invalid JWT token: {}", e.getMessage());
		} catch (final ExpiredJwtException e) {
			log.info("JWT token is expired: {}", e.getMessage());
		} catch (final UnsupportedJwtException e) {
			log.info("JWT token is unsupported: {}", e.getMessage());
		} catch (final IllegalArgumentException e) {
			log.info("JWT claims string is empty: {}", e.getMessage());
		}
		return false;
	}

	public <T> T extractClaim(final String token, final Function<Claims, T> resolver) {
		return resolver.apply(Jwts.parserBuilder().setSigningKey(this.key).build()
				.parseClaimsJws(token).getBody());
	}

	public boolean isTokenValid(final String token, final String username) {
		try {
			return this.getUsernameFromToken(token).equals(username) && !this.isTokenExpired(token);
		} catch (final Exception e) {
			return false;
		}
	}

	private boolean isTokenExpired(final String token) {
		return this.extractClaim(token, Claims::getExpiration).before(new Date());
	}
}
