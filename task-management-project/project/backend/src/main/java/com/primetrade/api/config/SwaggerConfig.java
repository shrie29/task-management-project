package com.primetrade.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title       = "Task Management REST API",
        version     = "v1",
        description = "Scalable REST API with JWT Auth and Role-Based Access Control",
        contact     = @Contact(name = "Shriesh", email = "shriesh@example.com")
    ),
    servers = @Server(url = "http://localhost:8080", description = "Local Development Server")
)
@SecurityScheme(
    name   = "bearerAuth",
    type   = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in     = SecuritySchemeIn.HEADER
)
public class SwaggerConfig {
    // springdoc-openapi auto-configures; this class only holds annotations
}
