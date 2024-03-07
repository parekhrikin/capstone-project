package com.learning.bankingapplication.config;

import com.learning.bankingapplication.entity.Customer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomerDetails implements UserDetails  {

    private String username;
    private String fullname;
    private String password;

    private List<GrantedAuthority> authorities;

    public CustomerDetails(Customer customer) {
        username = customer.getUsername();
        fullname = customer.getFullname();
        password = customer.getPassword();
        authorities= Arrays.stream(customer.getRoles().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }





    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getFullName(){
        return fullname;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
