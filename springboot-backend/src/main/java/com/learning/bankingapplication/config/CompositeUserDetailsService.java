package com.learning.bankingapplication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CompositeUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerDetailsService customerDetailsService;
    @Autowired
    private StaffDetailsService staffDetailsService;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Determine the user's role based on username
        if (customerDetailsService.existsByUsername(username)) {
            return customerDetailsService.loadUserByUsername(username);
        } else if (staffDetailsService.existsByUsername(username)) {
            return staffDetailsService.loadUserByUsername(username);
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
