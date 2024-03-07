package com.learning.bankingapplication.config;

import com.learning.bankingapplication.entity.Customer;
import com.learning.bankingapplication.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomerDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    public boolean existsByUsername(String username) {
        return customerRepository.findByUsername(username).isPresent();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Customer> customer = customerRepository.findByUsername(username);

        return customer.map(CustomerDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found " + username));
    }


}
