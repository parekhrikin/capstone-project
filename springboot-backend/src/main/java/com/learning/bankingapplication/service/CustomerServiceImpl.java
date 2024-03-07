package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Account;
import com.learning.bankingapplication.entity.Customer;
import com.learning.bankingapplication.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService{

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Customer save(Customer c) {

        c.setRoles("ROLE_CUST");
        c.setPassword(passwordEncoder.encode(c.getPassword()));
        c.setStatus(Customer.Status.ENABLED);

        return customerRepository.save(c);
    }

    @Override
    public Customer update(Optional<Customer> c) {

        return customerRepository.save(c.get());
    }

    @Override
    public Optional<Customer> findById(Integer id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> findByUsername(String username) {
        return customerRepository.findByUsername(username);
    }

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> delete(Integer id) {
        Optional<Customer> c = customerRepository.findById(id);
        customerRepository.deleteById(id);
        return c;
    }


}
