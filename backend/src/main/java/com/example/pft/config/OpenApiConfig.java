package com.example.pft.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(info = @Info(contact = @Contact(name = "Uday Rishi Kumar", email = "udayrishi.ganji.w@gmail.com", url = "https://www.linkedin.com/in/uday-rishi-kumar--ganji/"), description = "OpenAPI documentation for Personal Finance Tracker API", title = "PFT API - OpenAPI Specification", version = "1.0.0", license = @License(name = "MIT License", url = "https://opensource.org/licenses/MIT"), termsOfService = "https://example.com.com/terms"), servers = {
		@Server(description = "Local Environment", url = "http://localhost:8080"),
		@Server(description = "Production Environment", url = "https://example.com")
}, security = { @SecurityRequirement(name = "bearerAuth") })
@SecurityScheme(name = "bearerAuth", description = "JWT Authentication using Bearer Token. Paste your access token below (no quotes). Prepend with Bearer", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
@Configuration
public class OpenApiConfig {
}
