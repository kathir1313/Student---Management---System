package com.kathiravan.student_management_system.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.kathiravan.student_management_system.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "AUTH HEADER = " + authHeader);

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response);
            return;
        }

        try {

            String token =
                    authHeader.substring(7);

            System.out.println(
                    "TOKEN = " + token);

            if (!jwtService.validateToken(token)) {

                System.out.println(
                        "TOKEN INVALID");

                filterChain.doFilter(
                        request,
                        response);
                return;
            }

            String username =
                    jwtService.extractUsername(token);

            String role =
                    jwtService.extractRole(token);

            System.out.println(
                    "USERNAME = " + username);

            System.out.println(
                    "ROLE = " + role);

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role)));

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

                System.out.println(
                        "AUTHENTICATION SET SUCCESSFULLY");
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR = "
                            + e.getMessage());

            e.printStackTrace();
        }

        filterChain.doFilter(
                request,
                response);
    }
}