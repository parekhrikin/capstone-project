package com.learning.bankingapplication.service;

import com.learning.bankingapplication.entity.Account;
import com.learning.bankingapplication.entity.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerService {

    public Customer save(Customer c);

    public Customer update(Optional<Customer> c);

    public Optional<Customer> findById(Integer id);

    Optional<Customer> findByUsername(String username);

    public List<Customer> findAll();

    public Optional<Customer> delete(Integer id);


}
