package com.eventwave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EntityScan("com.eventwave.model")
@EnableJpaRepositories("com.eventwave.repository")
@ComponentScan(basePackages = {
		"com.eventwave",                   // your main app package
		"com.eventwave.config",            // for SecurityConfig
		"com.eventwave.controller",        // if your controllers are here
		"com.eventwave.service",           // if your services are here
		"com.eventwave.repository",
		"com.eventwave.exception",
		"com.eventwave.security"
		// if you use any additional repositories
	})

public class EventWaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventWaveApplication.class, args);
	}

}
