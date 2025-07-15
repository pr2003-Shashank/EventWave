package com.eventwave.config;

import com.eventwave.model.Category;
import com.eventwave.model.Role;
import com.eventwave.repository.CategoryRepository;
import com.eventwave.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        seedRoles();
        seedCategories();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName("USER");

            Role organizerRole = new Role();
            organizerRole.setName("ORGANIZER");

            roleRepository.saveAll(List.of(userRole, organizerRole));
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            Category tech = new Category();
            tech.setName("Tech");

            Category music = new Category();
            music.setName("Music");

            Category sports = new Category();
            sports.setName("Sports");

            Category education = new Category();
            education.setName("Education");
            
            Category business = new Category();
            business.setName("Business");
            
            Category art = new Category();
            art.setName("Art");

            Category health = new Category();
            health.setName("Health");

            categoryRepository.saveAll(List.of(tech, music, sports, education, business, art, health));
        }
    }
}
