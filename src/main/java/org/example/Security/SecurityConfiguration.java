package org.example.Security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfiguration corsConfig;   // можно напрямую внедрить CorsConfigurationSource

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Подключаем наш CORS-бин
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))

                // 2. Отключаем CSRF (для REST API, где нет форм и кук)
                .csrf(csrf -> csrf.disable())

                // 3. Отключаем сессии – всё по токенам
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Правила доступа
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()   // логин/регистрация открыты
                        .anyRequest().authenticated()                 // всё остальное только с токеном
                )

                // 5. Добавляем наш JWT-фильтр перед стандартным UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}