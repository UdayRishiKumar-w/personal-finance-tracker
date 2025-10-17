package com.example.pft.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(info = @Info(contact = @Contact(name = "Uday Rishi Kumar", email = "udayrishi.ganji.w@gmail.com", url = "https://www.linkedin.com/in/uday-rishi-kumar--ganji/"), description = "OpenApi documentation for PFT App API", title = "OpenApi specification - PFT", version = "1.0.0", license = @License(name = "License name", url = "https://example-license.com"), termsOfService = "Terms of service"), servers = {
		@Server(description = "Local ENV", url = "http://localhost:8080"),
		@Server(description = "PROD ENV", url = "http://localhost:8080") // PROD_URL
																			// https://example.com
}, security = { @SecurityRequirement(name = "bearerAuth") })
@SecurityScheme(name = "bearerAuth", description = "JWT auth description", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {
}
