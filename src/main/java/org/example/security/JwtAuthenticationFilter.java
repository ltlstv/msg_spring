    package org.example.security;

    import jakarta.servlet.FilterChain;
    import jakarta.servlet.ServletException;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import lombok.RequiredArgsConstructor;
    import org.example.dataBase.User;
    import org.example.dataBase.UserRepository;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
    import org.springframework.stereotype.Component;
    import org.springframework.web.filter.OncePerRequestFilter;
    import java.io.IOException;
    import java.util.Collections;

    @Component
    @RequiredArgsConstructor
    public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtUtill jwtUtill;
        private final UserRepository userRepository;

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            String header = request.getHeader("Authorization");

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);

                if (jwtUtill.validateToken(token)) {
                    int userId = jwtUtill.getUserIdFromToken(token);
                    User user = userRepository.findById(userId).orElse(null);

                    if (user != null) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        user, null, Collections.emptyList());
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        }
    }