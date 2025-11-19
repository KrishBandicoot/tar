package com.example.kkarhua.fullrest.config;

import com.example.kkarhua.fullrest.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ← IMPORTANTE
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas de autenticación
                .requestMatchers("/api/auth/login", "/api/auth/refresh", "/api/auth/logout").permitAll()
                
                // Registro público
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                
                // Documentación Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                
                // Imágenes públicas
                .requestMatchers("/uploads/**", "/api/imagenes/**").permitAll()
                
                // Productos - lectura pública
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                
                // Productos - escritura requiere autenticación
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                
                // Categorías - escritura requiere autenticación
                .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                
                // Stock - solo para vendedores y admin
                .requestMatchers("/api/stock/**").hasAnyRole("VENDEDOR", "SUPER-ADMIN")
                
                // Usuarios - gestión solo super-admin
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasRole("SUPER-ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasRole("SUPER-ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("SUPER-ADMIN")
                
                // Validación de tokens
                .requestMatchers("/api/auth/validate", "/api/auth/validate-admin").permitAll()
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174", 
            "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}