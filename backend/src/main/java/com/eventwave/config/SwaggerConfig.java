package com.eventwave.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "EventWave API",
        version = "v1.0",
        description = "API documentation for the EventWave platform"
    ),
    servers = {
        @Server(url = "http://localhost:8080")
    }
)
public class SwaggerConfig {
}
