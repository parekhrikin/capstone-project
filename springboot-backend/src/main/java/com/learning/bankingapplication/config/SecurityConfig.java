package com.learning.bankingapplication.config;

import com.learning.bankingapplication.filter.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter authFilter;

    @Autowired
    private CompositeUserDetailsService userDetailsService;

//    @Bean
//    //authentication
//    public UserDetailsService userDetailsService() {
//
////         UserDetails admin = User.withUsername("Basant")
////         .password(encoder.encode("Pwd1")).roles("ADMIN").build();
////         UserDetails user = User.withUsername("John")
////         .password(encoder.encode("Pwd2")).roles("USER","ADMIN","HR").build();
////         return new InMemoryUserDetailsManager(admin, user);
//
//        return new CustomerDetailsService();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http.csrf().disable()
//                .authorizeHttpRequests()
//                .requestMatchers("/api/customer/register","/api/customer/authenticate").permitAll()
//                .and()
//                .authorizeHttpRequests().requestMatchers("/api/customer/**")
//                .authenticated().and()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authenticationProvider(authenticationProvider())
//                .build();
        //Enable CORS and disable CSRF
        http = http.cors().and().csrf().disable();

        //Set session management to stateless
        http = http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and();

        //Set unauthorized requests exception handler
        http = http.exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, ex) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED,
                                    ex.getMessage()
                            );
                        }
                )
                .and();

        //Set permissions on endpoints
        return http.authorizeHttpRequests()
                .requestMatchers("/api/customer/register","/api/customer/authenticate", "/api/staff/register", "/api/staff/authenticate", "/api/admin/authenticate").permitAll()
                .and()
                .authorizeHttpRequests().requestMatchers("/api/customer/**").authenticated()
                .and()
                .authorizeHttpRequests().requestMatchers("/api/staff/**").authenticated()
                .and()
                .authorizeHttpRequests().requestMatchers("/api/admin/**").authenticated()
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(
                        authFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider=new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
